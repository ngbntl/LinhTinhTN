import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JapaneseWord {
  id: number;
  hiragana: string;
  kanji: string;
  meaning: string;
  example: string;
}

interface DayData {
  day: number;
  title: string;
  words: JapaneseWord[];
}

interface WordProgress {
  wordId: number;
  known: boolean;
  reviewCount: number;
  lastReviewed: string;
  difficulty: "easy" | "medium" | "hard";
  nextReviewDate: string;
}

interface VocabularyState {
  currentDay: number;
  completedDays: number[];
  wordProgress: Record<number, WordProgress>;
  studyMode: "hiragana" | "kanji" | "mixed";
  showFurigana: boolean;

  // Actions
  setCurrentDay: (day: number) => void;
  markDayCompleted: (day: number) => void;
  markWordKnown: (
    wordId: number,
    known: boolean,
    difficulty?: "easy" | "medium" | "hard"
  ) => void;
  getWordProgress: (wordId: number) => WordProgress | undefined;
  getDayProgress: (day: number, totalWordsInDay: number) => number;
  getWordsNeedingReview: () => number[];
  setStudyMode: (mode: "hiragana" | "kanji" | "mixed") => void;
  toggleFurigana: () => void;
  resetProgress: () => void;

  // Statistics
  getOverallStats: () => {
    totalWords: number;
    knownWords: number;
    reviewWords: number;
    completionRate: number;
    averageReviewCount: number;
  };
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      currentDay: 1,
      completedDays: [],
      wordProgress: {},
      studyMode: "mixed",
      showFurigana: true,

      setCurrentDay: (day: number) => {
        set({ currentDay: day });
      },

      markDayCompleted: (day: number) => {
        set((state) => ({
          completedDays: state.completedDays.includes(day)
            ? state.completedDays
            : [...state.completedDays, day],
        }));
      },

      markWordKnown: (
        wordId: number,
        known: boolean,
        difficulty: "easy" | "medium" | "hard" = "medium"
      ) => {
        const now = new Date();
        const nextReview = new Date(now);

        // Spaced repetition logic
        if (known) {
          switch (difficulty) {
            case "easy":
              nextReview.setDate(now.getDate() + 7); // 7 days
              break;
            case "medium":
              nextReview.setDate(now.getDate() + 3); // 3 days
              break;
            case "hard":
              nextReview.setDate(now.getDate() + 1); // 1 day
              break;
          }
        } else {
          nextReview.setHours(now.getHours() + 1); // 1 hour for unknown words
        }

        set((state) => ({
          wordProgress: {
            ...state.wordProgress,
            [wordId]: {
              wordId,
              known,
              difficulty,
              reviewCount: (state.wordProgress[wordId]?.reviewCount || 0) + 1,
              lastReviewed: now.toISOString(),
              nextReviewDate: nextReview.toISOString(),
            },
          },
        }));
      },

      getWordProgress: (wordId: number) => {
        return get().wordProgress[wordId];
      },

      getDayProgress: (day: number, totalWordsInDay: number) => {
        if (totalWordsInDay === 0) return 0;

        const { wordProgress } = get();
        let knownCount = 0;

        // Tìm tất cả từ trong ngày này (cần biết range wordId)
        Object.values(wordProgress).forEach((progress) => {
          if (progress.known) {
            knownCount++;
          }
        });

        // Tính theo tổng số từ trong ngày
        return Math.round((knownCount / totalWordsInDay) * 100);
      },

      getWordsNeedingReview: () => {
        const now = new Date();
        const { wordProgress } = get();

        return Object.values(wordProgress)
          .filter((progress) => {
            const nextReview = new Date(progress.nextReviewDate);
            return nextReview <= now;
          })
          .map((progress) => progress.wordId);
      },

      setStudyMode: (mode: "hiragana" | "kanji" | "mixed") => {
        set({ studyMode: mode });
      },

      toggleFurigana: () => {
        set((state) => ({ showFurigana: !state.showFurigana }));
      },

      getOverallStats: () => {
        const { wordProgress } = get();
        const progressValues = Object.values(wordProgress);

        const totalWords = progressValues.length;
        const knownWords = progressValues.filter((p) => p.known).length;
        const reviewWords = progressValues.filter(
          (p) => !p.known && p.reviewCount > 0
        ).length;
        const completionRate =
          totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;
        const averageReviewCount =
          totalWords > 0
            ? Math.round(
                progressValues.reduce((sum, p) => sum + p.reviewCount, 0) /
                  totalWords
              )
            : 0;

        return {
          totalWords,
          knownWords,
          reviewWords,
          completionRate,
          averageReviewCount,
        };
      },

      resetProgress: () => {
        set({
          currentDay: 1,
          completedDays: [],
          wordProgress: {},
          studyMode: "mixed",
          showFurigana: true,
        });
      },
    }),
    {
      name: "japanese-vocabulary-progress",
      version: 2,
    }
  )
);
