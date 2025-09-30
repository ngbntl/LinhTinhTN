import { useState, useEffect } from "react";
import { ExcelReader, JapaneseWord, DayData } from "../utils/excelReader";

export const useVocabulary = () => {
  const [data, setData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocabularyData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Đọc file Excel từ public folder
        const rawVocabularyData = await ExcelReader.readVocabularyFromPath(
          "/data.xlsx"
        );

        // Phân tích và loại bỏ từ trùng lặp
        const duplicateAnalysis =
          ExcelReader.analyzeDuplicates(rawVocabularyData);
        console.log("Duplicate analysis:", duplicateAnalysis);

        // Loại bỏ từ trùng lặp
        const vocabularyData =
          ExcelReader.removeDuplicateWords(rawVocabularyData);

        // Validate dữ liệu sau khi đã loại bỏ trùng lặp
        const validation = ExcelReader.validateData(vocabularyData);
        if (!validation.isValid) {
          console.warn("Data validation warnings:", validation.errors);
        }

        console.log(
          "Vocabulary stats after removing duplicates:",
          validation.stats
        );
        console.log(`Removed ${duplicateAnalysis.duplicates} duplicate words`);

        setData(vocabularyData);
      } catch (err) {
        console.error("Error loading vocabulary data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load vocabulary data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVocabularyData();
  }, []);

  const getDayData = (day: number): DayData | null => {
    const dayKey = `day${day}`;
    return data[dayKey] || null;
  };

  const getAllDays = (): number[] => {
    return Object.keys(data)
      .filter((key) => key.startsWith("day"))
      .map((key) => parseInt(key.replace("day", "")))
      .sort((a, b) => a - b);
  };

  const getTotalDays = (): number => {
    return getAllDays().length;
  };

  const searchWords = (query: string): JapaneseWord[] => {
    if (!query.trim()) return [];

    const results: JapaneseWord[] = [];
    const searchTerm = query.toLowerCase();

    Object.values(data).forEach((dayData) => {
      dayData.words.forEach((word) => {
        if (
          word.hiragana.toLowerCase().includes(searchTerm) ||
          word.kanji.toLowerCase().includes(searchTerm) ||
          word.meaning.toLowerCase().includes(searchTerm) ||
          word.example.toLowerCase().includes(searchTerm)
        ) {
          results.push(word);
        }
      });
    });

    return results;
  };

  const getRandomWordsForQuiz = (
    excludeDay?: number,
    count: number = 10
  ): JapaneseWord[] => {
    const allWords: JapaneseWord[] = [];

    Object.entries(data).forEach(([key, dayData]) => {
      const dayNum = parseInt(key.replace("day", ""));
      if (excludeDay && dayNum === excludeDay) return;

      allWords.push(...dayData.words);
    });

    // Shuffle and take random words
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getWordsForReview = (onlyUnknown: boolean = true): JapaneseWord[] => {
    // This would integrate with vocabulary store to get words that need review
    const allWords: JapaneseWord[] = [];
    Object.values(data).forEach((dayData) => {
      allWords.push(...dayData.words);
    });
    return allWords;
  };

  const getWordsByIds = async (wordIds: number[]): Promise<JapaneseWord[]> => {
    const allWords: JapaneseWord[] = [];
    Object.values(data).forEach((dayData) => {
      allWords.push(...dayData.words);
    });

    return allWords.filter((word) => wordIds.includes(word.id));
  };

  const getAllWords = async (): Promise<JapaneseWord[]> => {
    const allWords: JapaneseWord[] = [];
    Object.values(data).forEach((dayData) => {
      allWords.push(...dayData.words);
    });
    return allWords;
  };

  const getWordsByDays = (days: number[]): JapaneseWord[] => {
    const words: JapaneseWord[] = [];
    days.forEach((day) => {
      const dayData = getDayData(day);
      if (dayData) {
        words.push(...dayData.words);
      }
    });
    return words;
  };

  const getFilteredWords = (
    days: number[],
    difficulty: "all" | "learned" | "unlearned" | "review",
    wordProgress: Record<number, any>
  ): JapaneseWord[] => {
    const allWords = getWordsByDays(days);

    switch (difficulty) {
      case "learned":
        return allWords.filter((word) => wordProgress[word.id]?.known === true);
      case "unlearned":
        return allWords.filter(
          (word) =>
            !wordProgress[word.id] || wordProgress[word.id]?.known === false
        );
      case "review":
        return allWords.filter(
          (word) => wordProgress[word.id] && !wordProgress[word.id]?.known
        );
      default:
        return allWords;
    }
  };

  const exportToJSON = (): string => {
    return ExcelReader.exportToJSON(data);
  };

  // Upload new Excel file
  const uploadExcelFile = async (file: File): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await ExcelReader.readVocabularyFile(file);

      // Phân tích và loại bỏ từ trùng lặp từ file mới
      const duplicateAnalysis = ExcelReader.analyzeDuplicates(rawData);
      console.log("Duplicate analysis for uploaded file:", duplicateAnalysis);

      const cleanData = ExcelReader.removeDuplicateWords(rawData);
      const validation = ExcelReader.validateData(cleanData);

      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(", ")}`);
      }

      setData(cleanData);
      console.log("New vocabulary uploaded:", validation.stats);
      console.log(
        `Removed ${duplicateAnalysis.duplicates} duplicate words from uploaded file`
      );
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getDayData,
    getAllDays,
    getTotalDays,
    searchWords,
    getRandomWordsForQuiz,
    getWordsForReview,
    getWordsByIds,
    getAllWords,
    getWordsByDays,
    getFilteredWords,
    exportToJSON,
    uploadExcelFile,
  };
};
