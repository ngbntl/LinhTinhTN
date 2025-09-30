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

export class ExcelReader {
  static async readVocabularyFile(
    file: File
  ): Promise<Record<string, DayData>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const result = this.parseWorkbook(workbook);
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
    filePath: string
  ): Promise<Record<string, DayData>> {
    try {
      // Đọc file từ public folder
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      return this.parseWorkbook(workbook);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw error;
    }
  }

  private static parseWorkbook(
    workbook: XLSX.WorkBook
  ): Record<string, DayData> {
    const result: Record<string, DayData> = {};
    let wordId = 1;

    // Duyệt qua tất cả các sheet
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Bỏ qua dòng header (dòng đầu tiên)
      const rows = jsonData.slice(1) as any[][];

      const words: JapaneseWord[] = rows
        .filter((row) => row.length >= 4 && row[0] && row[1]) // Đảm bảo có đủ dữ liệu
        .map((row) => ({
          id: wordId++,
          hiragana: String(row[0] || "").trim(),
          kanji: String(row[1] || "").trim(),
          meaning: String(row[2] || "").trim(),
          example: String(row[3] || "").trim(),
        }));

      if (words.length > 0) {
        const dayKey = `day${index + 1}`;
        result[dayKey] = {
          day: index + 1,
          title: this.generateDayTitle(sheetName, index + 1),
          words,
        };
      }
    });

    return result;
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
