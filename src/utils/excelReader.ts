import * as XLSX from "xlsx";

export interface JapaneseWord {
  id: number;
  hiragana: string;
  kanji: string;
  meaning: string;
  example: string;
}

export interface DayData {
  day: number;
  title: string;
  words: JapaneseWord[];
}

export interface ExcelProcessingOptions {
  removeDuplicates: boolean;
  skipEmptyRows: boolean;
  autoDetectColumns: boolean;
  columnMapping?: {
    hiragana: number;
    kanji: number;
    meaning: number;
    example: number;
  };
}

export class ExcelReader {
  static async readVocabularyFile(
    file: File,
    options: ExcelProcessingOptions = {
      removeDuplicates: true,
      skipEmptyRows: true,
      autoDetectColumns: true
    }
  ): Promise<Record<string, DayData>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const result = this.parseWorkbook(workbook, options);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  static async readVocabularyFromPath(
    filePath: string,
    options: ExcelProcessingOptions = {
      removeDuplicates: true,
      skipEmptyRows: true,
      autoDetectColumns: true
    }
  ): Promise<Record<string, DayData>> {
    try {
      // Đọc file từ public folder
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      return this.parseWorkbook(workbook, options);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw error;
    }
  }

  private static parseWorkbook(
    workbook: XLSX.WorkBook,
    options: ExcelProcessingOptions
  ): Record<string, DayData> {
    const result: Record<string, DayData> = {};
    let wordId = 1;
    const seenWords = new Set<string>();

    console.log(`Processing ${workbook.SheetNames.length} sheets:`, workbook.SheetNames);

    // Duyệt qua tất cả các sheet
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log(`Sheet "${sheetName}" has ${jsonData.length} rows`);

      // Không bỏ qua dòng đầu vì không có header
      const rows = jsonData as any[][];

      // Tự động phát hiện cột nếu được bật
      const columnMapping = options.autoDetectColumns 
        ? this.detectColumnMapping(rows)
        : options.columnMapping || { hiragana: 0, kanji: 1, meaning: 2, example: 3 };

      console.log(`Using column mapping for "${sheetName}":`, columnMapping);

      const words: JapaneseWord[] = rows
        .filter((row) => {
          if (options.skipEmptyRows && (!row || row.length === 0)) return false;
          // Kiểm tra có ít nhất hiragana hoặc kanji và meaning
          return (row[columnMapping.hiragana] || row[columnMapping.kanji]) && row[columnMapping.meaning];
        })
        .map((row) => ({
          id: wordId++,
          hiragana: String(row[columnMapping.hiragana] || "").trim(),
          kanji: String(row[columnMapping.kanji] || "").trim(),
          meaning: String(row[columnMapping.meaning] || "").trim(),
          example: String(row[columnMapping.example] || "").trim(),
        }))
        .filter((word) => {
          if (!options.removeDuplicates) return true;
          
          // Tạo key duy nhất cho từ
          const wordKey = `${word.hiragana.toLowerCase()}-${word.kanji.toLowerCase()}-${word.meaning.toLowerCase()}`;
          
          // Chỉ thêm từ nếu chưa thấy trước đó
          if (!seenWords.has(wordKey)) {
            seenWords.add(wordKey);
            return true;
          }
          console.log(`Duplicate word found: ${word.hiragana} (${word.kanji}) - ${word.meaning}`);
          return false;
        });

      if (words.length > 0) {
        const dayKey = `day${index + 1}`;
        result[dayKey] = {
          day: index + 1,
          title: this.generateDayTitle(sheetName, index + 1),
          words,
        };
        console.log(`Sheet "${sheetName}" processed: ${words.length} unique words`);
      } else {
        console.warn(`Sheet "${sheetName}" has no valid words`);
      }
    });

    return result;
  }

  // Tự động phát hiện cột dựa trên nội dung
  private static detectColumnMapping(rows: any[][]): {
    hiragana: number;
    kanji: number;
    meaning: number;
    example: number;
  } {
    // Mặc định
    const defaultMapping = { hiragana: 0, kanji: 1, meaning: 2, example: 3 };
    
    if (!rows || rows.length === 0) return defaultMapping;

    // Lấy vài dòng đầu để phân tích
    const sampleRows = rows.slice(0, Math.min(5, rows.length));
    
    // Tạm thời trả về mapping mặc định
    // Có thể cải tiến thêm logic phát hiện tự động dựa trên pattern
    return defaultMapping;
  }

  private static generateDayTitle(
    sheetName: string,
    dayNumber: number
  ): string {
    // Nếu sheet name có thông tin có ý nghĩa, sử dụng nó
    if (sheetName && !sheetName.toLowerCase().includes("sheet")) {
      return sheetName;
    }

    // Nếu không, tạo title mặc định
    return `Ngày ${dayNumber}`;
  }

  // Utility để export dữ liệu ra JSON (cho development)
  static exportToJSON(data: Record<string, DayData>): string {
    return JSON.stringify(data, null, 2);
  }

  // Method để loại bỏ từ trùng lặp từ dữ liệu đã parse
  static removeDuplicateWords(
    data: Record<string, DayData>
  ): Record<string, DayData> {
    const result: Record<string, DayData> = {};
    const seenWords = new Set<string>();
    let newWordId = 1;

    // Sắp xếp các ngày theo thứ tự
    const sortedDays = Object.keys(data).sort((a, b) => {
      const dayA = parseInt(a.replace("day", ""));
      const dayB = parseInt(b.replace("day", ""));
      return dayA - dayB;
    });

    sortedDays.forEach((dayKey) => {
      const dayData = data[dayKey];
      const uniqueWords: JapaneseWord[] = [];

      dayData.words.forEach((word) => {
        // Tạo key duy nhất cho từ
        const wordKey = `${word.hiragana.toLowerCase()}-${word.kanji.toLowerCase()}-${word.meaning.toLowerCase()}`;

        if (!seenWords.has(wordKey)) {
          seenWords.add(wordKey);
          // Gán lại ID mới để đảm bảo tính nhất quán
          uniqueWords.push({
            ...word,
            id: newWordId++,
          });
        }
      });

      // Chỉ thêm ngày nếu có từ vựng mới
      if (uniqueWords.length > 0) {
        result[dayKey] = {
          ...dayData,
          words: uniqueWords,
        };
      }
    });

    return result;
  }

  // Method để so sánh và hiển thị thống kê trùng lặp
  static analyzeDuplicates(data: Record<string, DayData>): {
    totalWords: number;
    uniqueWords: number;
    duplicates: number;
    duplicatesByDay: Record<string, number>;
    duplicateDetails: Array<{
      word: string;
      occurrences: string[];
    }>;
  } {
    const seenWords = new Map<string, string[]>();
    let totalWords = 0;
    let duplicates = 0;
    const duplicatesByDay: Record<string, number> = {};

    Object.entries(data).forEach(([dayKey, dayData]) => {
      let dayDuplicates = 0;

      dayData.words.forEach((word) => {
        totalWords++;
        const wordKey = `${word.hiragana.toLowerCase()}-${word.kanji.toLowerCase()}-${word.meaning.toLowerCase()}`;
        const wordDisplay = `${word.hiragana} (${word.kanji}) - ${word.meaning}`;

        if (seenWords.has(wordKey)) {
          duplicates++;
          dayDuplicates++;
          seenWords.get(wordKey)!.push(dayKey);
        } else {
          seenWords.set(wordKey, [dayKey]);
        }
      });

      duplicatesByDay[dayKey] = dayDuplicates;
    });

    // Tạo chi tiết từ trùng lặp
    const duplicateDetails = Array.from(seenWords.entries())
      .filter(([, occurrences]) => occurrences.length > 1)
      .map(([wordKey, occurrences]) => ({
        word: wordKey,
        occurrences,
      }));

    return {
      totalWords,
      uniqueWords: seenWords.size,
      duplicates,
      duplicatesByDay,
      duplicateDetails,
    };
  }

  // Tạo file Excel mẫu
  static createSampleExcel(): void {
    const sampleData = [
      // Sheet 1 - Ngày 1
      [
        ['こんにちは', 'こんにちは', 'xin chào', 'こんにちは、田中さん'],
        ['ありがとう', 'ありがとう', 'cảm ơn', 'ありがとうございます'],
      ],
      // Sheet 2 - Ngày 2
      [
        ['がっこう', '学校', 'trường học', '学校に行きます'],
        ['ともだち', '友達', 'bạn bè', '友達と遊びます'],
      ],
    ];

    const wb = XLSX.utils.book_new();
    
    sampleData.forEach((sheetData, index) => {
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, `Day${index + 1}`);
    });

    XLSX.writeFile(wb, 'sample_vocabulary.xlsx');
  }

  // Utility để validate dữ liệu
  static validateData(data: Record<string, DayData>): {
    isValid: boolean;
    errors: string[];
    stats: {
      totalDays: number;
      totalWords: number;
      averageWordsPerDay: number;
    };
  } {
    const errors: string[] = [];
    let totalWords = 0;
    const days = Object.keys(data);

    days.forEach((dayKey) => {
      const dayData = data[dayKey];

      if (!dayData.words || dayData.words.length === 0) {
        errors.push(`${dayKey}: Không có từ vựng nào`);
      }

      dayData.words.forEach((word, index) => {
        if (!word.hiragana && !word.kanji) {
          errors.push(`${dayKey}, từ ${index + 1}: Thiếu hiragana hoặc kanji`);
        }
        if (!word.meaning) {
          errors.push(`${dayKey}, từ ${index + 1}: Thiếu nghĩa`);
        }
      });

      totalWords += dayData.words.length;
    });

    return {
      isValid: errors.length === 0,
      errors,
      stats: {
        totalDays: days.length,
        totalWords,
        averageWordsPerDay:
          days.length > 0 ? Math.round(totalWords / days.length) : 0,
      },
    };
  }
}

// Helper functions cho tiếng Nhật
export const JapaneseUtils = {
  // Kiểm tra có phải hiragana không
  isHiragana: (str: string): boolean => {
    return /^[\u3040-\u309F]+$/.test(str);
  },

  // Kiểm tra có phải katakana không
  isKatakana: (str: string): boolean => {
    return /^[\u30A0-\u30FF]+$/.test(str);
  },

  // Kiểm tra có phải kanji không
  isKanji: (str: string): boolean => {
    return /^[\u4E00-\u9FAF]+$/.test(str);
  },

  // Tạo furigana display (kanji với hiragana phía trên)
  createFurigana: (kanji: string, hiragana: string): string => {
    if (!kanji) return hiragana;
    if (!hiragana) return kanji;
    return `${kanji}(${hiragana})`;
  },
};
