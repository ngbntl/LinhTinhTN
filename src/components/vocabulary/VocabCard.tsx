import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Eye, EyeOff, Check, X, Clock } from "lucide-react";
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

interface VocabCardProps {
  word: JapaneseWord;
  showActions?: boolean;
  mode?: "study" | "review" | "quiz";
  showAnswer?: boolean;
}

export const VocabCard = ({
  word,
  showActions = true,
  mode = "study",
  showAnswer = true,
}: VocabCardProps) => {
  const {
    getWordProgress,
    markWordKnown,
    studyMode,
    showFurigana,
    toggleFurigana,
  } = useVocabularyStore();
  const progress = getWordProgress(word.id);
  const [showMeaning, setShowMeaning] = useState(showAnswer);

  const handleMarkKnown = (
    known: boolean,
    difficulty?: "easy" | "medium" | "hard"
  ) => {
    markWordKnown(word.id, known, difficulty);
    if (mode === "review") {
      setShowMeaning(true);
    }
  };

  const playPronunciation = () => {
    // Text-to-speech API cho tiếng Nhật
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.hiragana);
      utterance.lang = "ja-JP";
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const getProgressColor = () => {
    if (!progress) return "";
    if (progress.known) return "ring-2 ring-green-200 bg-green-50";
    if (progress.reviewCount > 0) return "ring-2 ring-orange-200 bg-orange-50";
    return "";
  };

  const renderJapaneseText = () => {
    const hasKanji = word.kanji && word.kanji.trim() !== "";
    const hasHiragana = word.hiragana && word.hiragana.trim() !== "";

    switch (studyMode) {
      case "hiragana":
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {word.hiragana}
            </span>
            {hasKanji && showFurigana && (
              <span className="text-lg text-gray-600">{word.kanji}</span>
            )}
          </div>
        );

      case "kanji":
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {word.kanji || word.hiragana}
            </span>
            {hasKanji && hasHiragana && showFurigana && (
              <span className="text-sm text-gray-600 font-mono">
                ({word.hiragana})
              </span>
            )}
          </div>
        );

      case "mixed":
      default:
        return (
          <div className="flex flex-col items-start gap-1">
            {hasKanji ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {word.kanji}
                </span>
                {showFurigana && (
                  <span className="text-lg text-blue-600 font-mono">
                    {word.hiragana}
                  </span>
                )}
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {word.hiragana}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        "w-full transition-all duration-200 hover:shadow-md",
        getProgressColor(),
        mode === "quiz" && !showMeaning && "min-h-[200px]"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {renderJapaneseText()}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playPronunciation}
                  className="p-2 h-8 w-8 rounded-full hover:bg-blue-100"
                  title="Phát âm"
                >
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </Button>

                {word.kanji && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFurigana}
                    className="p-2 h-8 w-8 rounded-full hover:bg-purple-100"
                    title={showFurigana ? "Ẩn furigana" : "Hiện furigana"}
                  >
                    {showFurigana ? (
                      <EyeOff className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-purple-600" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {progress?.known && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Check className="w-3 h-3 mr-1" />
                Đã thuộc
              </Badge>
            )}

            {progress?.reviewCount && progress.reviewCount > 0 && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {progress.reviewCount}x
              </Badge>
            )}
          </div>
        </div>

        {/* Meaning and Example - có thể ẩn trong quiz mode */}
        {showMeaning && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Nghĩa:</h4>
              <p className="text-xl text-blue-900 font-medium">
                {word.meaning}
              </p>
            </div>

            {word.example && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ví dụ:</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-800 mb-1 leading-relaxed">
                    {word.example}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz mode - Show answer button */}
        {mode === "quiz" && !showMeaning && (
          <div className="text-center py-4">
            <Button
              onClick={() => setShowMeaning(true)}
              variant="outline"
              className="bg-blue-50 border-blue-200 hover:bg-blue-100"
            >
              Hiện đáp án
            </Button>
          </div>
        )}

        {/* Action buttons */}
        {showActions && showMeaning && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant={progress?.known ? "default" : "outline"}
                size="sm"
                onClick={() => handleMarkKnown(true, "easy")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4" />
                Dễ
              </Button>

              <Button
                variant={progress?.known ? "default" : "outline"}
                size="sm"
                onClick={() => handleMarkKnown(true, "medium")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Check className="w-4 h-4" />
                Bình thường
              </Button>

              <Button
                variant={progress?.known ? "default" : "outline"}
                size="sm"
                onClick={() => handleMarkKnown(true, "hard")}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Check className="w-4 h-4" />
                Khó
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkKnown(false)}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                Chưa thuộc
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {progress?.reviewCount && progress.reviewCount > 0 && (
                <span>Ôn lần {progress.reviewCount}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
