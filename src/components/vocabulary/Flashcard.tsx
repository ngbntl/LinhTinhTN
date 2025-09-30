import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, RotateCcw, Check, X, Clock } from "lucide-react";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JapaneseWord {
  id: number;
  hiragana: string;
  kanji: string;
  meaning: string;
  example: string;
}

interface FlashcardProps {
  word: JapaneseWord;
  showActions?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalWords?: number;
}

export const Flashcard = ({
  word,
  showActions = true,
  onNext,
  onPrev,
  currentIndex = 0,
  totalWords = 1,
}: FlashcardProps) => {
  const { getWordProgress, markWordKnown } = useVocabularyStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const progress = getWordProgress(word.id);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkKnown = (
    known: boolean,
    difficulty?: "easy" | "medium" | "hard"
  ) => {
    markWordKnown(word.id, known, difficulty);
    // Reset to front side first, then move to next card
    setIsFlipped(false);
    setTimeout(() => {
      onNext?.();
    }, 300); // Reduced timeout for better UX
  };

  const playPronunciation = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.hiragana);
      utterance.lang = "ja-JP";
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const resetCard = () => {
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          ← Trước
        </Button>

        <div className="text-center">
          <span className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {totalWords}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onNext}
          disabled={currentIndex === totalWords - 1}
          className="flex items-center gap-2"
        >
          Sau →
        </Button>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 mb-6">
        <div
          className={cn(
            "relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
            isFlipped && "rotate-y-180"
          )}
          onClick={handleFlip}
        >
          {/* Front side - Kanji only */}
          <Card className="absolute inset-0 backface-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="mb-4">
                <span className="text-6xl font-bold text-gray-900">
                  {word.kanji || word.hiragana}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {progress?.known && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Đã thuộc
                  </Badge>
                )}

                {progress?.reviewCount && progress.reviewCount > 0 && (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {progress.reviewCount}x
                  </Badge>
                )}
              </div>

              <p className="text-gray-500 text-sm">Click để xem đáp án</p>
            </CardContent>
          </Card>

          {/* Back side - Hiragana, meaning, example */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardContent className="flex flex-col justify-center h-full p-8">
              {/* Hiragana */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {word.hiragana}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation();
                    }}
                    className="p-2 h-8 w-8 rounded-full hover:bg-blue-100"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
              </div>

              {/* Meaning */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2 text-center">
                  Nghĩa:
                </h4>
                <p className="text-2xl text-center text-blue-900 font-medium">
                  {word.meaning}
                </p>
              </div>

              {/* Example */}
              {word.example && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-center">
                    Ví dụ:
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 text-center leading-relaxed">
                      {word.example}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-gray-500 text-sm text-center">
                Click để quay lại
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action buttons - show always when showActions is true */}
      {showActions && (
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(true, "easy");
            }}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            disabled={!isFlipped}
          >
            <Check className="w-4 h-4" />
            Dễ (7 ngày)
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(true, "medium");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            disabled={!isFlipped}
          >
            <Check className="w-4 h-4" />
            Bình thường (3 ngày)
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(true, "hard");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            disabled={!isFlipped}
          >
            <Check className="w-4 h-4" />
            Khó (1 ngày)
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(false);
            }}
            className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
            disabled={!isFlipped}
          >
            <X className="w-4 h-4" />
            Chưa thuộc
          </Button>
        </div>
      )}

      {/* Helper buttons */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetCard}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFlip}
          className="flex items-center gap-2"
        >
          {isFlipped ? "← Mặt trước" : "Mặt sau →"}
        </Button>
      </div>
    </div>
  );
};
