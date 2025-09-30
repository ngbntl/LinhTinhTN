import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VocabCard } from "@/components/vocabulary/VocabCard";
import { Flashcard } from "@/components/vocabulary/Flashcard";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useVocabularyStore } from "@/store/vocabularyStore";
import {
  ArrowLeft,
  ArrowRight,
  List,
  RotateCw,
  BookOpen,
  Brain,
} from "lucide-react";

export const DayView = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = parseInt(day || "1");

  const { getDayData, loading, getTotalDays } = useVocabulary();
  const {
    getWordProgress,
    markDayCompleted,
    setCurrentDay,
    studyMode,
    showFurigana,
  } = useVocabularyStore();

  const [viewMode, setViewMode] = useState<"list" | "flashcard">("list");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const dayData = getDayData(dayNumber);
  const totalDays = getTotalDays();

  useEffect(() => {
    setCurrentDay(dayNumber);
  }, [dayNumber, setCurrentDay]);

  const getProgress = () => {
    if (!dayData) return 0;
    const knownWords = dayData.words.filter((word) => {
      const progress = getWordProgress(word.id);
      return progress?.known;
    }).length;
    return Math.round((knownWords / dayData.words.length) * 100);
  };

  const handlePrevDay = () => {
    if (dayNumber > 1) {
      navigate(`/vocabulary/day/${dayNumber - 1}`);
    }
  };

  const handleNextDay = () => {
    if (dayNumber < totalDays) {
      navigate(`/vocabulary/day/${dayNumber + 1}`);
    }
  };

  const handleCompleteDay = () => {
    markDayCompleted(dayNumber);
    if (dayNumber < totalDays) {
      navigate(`/vocabulary/day/${dayNumber + 1}`);
    } else {
      navigate("/vocabulary");
    }
  };

  const handleNextWord = () => {
    if (dayData && currentWordIndex < dayData.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải từ vựng ngày {dayNumber}...</p>
        </div>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy dữ liệu
            </h3>
            <p className="text-gray-600 mb-4">
              Ngày {dayNumber} không có trong dữ liệu từ vựng
            </p>
            <Button onClick={() => navigate("/vocabulary")}>
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = getProgress();
  const currentWord = dayData.words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/vocabulary")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Ngày {dayNumber}: {dayData.title}
            </h1>
            <p className="text-gray-600">{dayData.words.length} từ vựng</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {studyMode === "mixed" ? "Mixed" : studyMode}
            </Badge>
            {showFurigana && (
              <Badge variant="outline" className="px-3 py-1">
                Furigana
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ học:</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Đã học:{" "}
                {
                  dayData.words.filter((w) => getWordProgress(w.id)?.known)
                    .length
                }
              </span>
              <span>Tổng: {dayData.words.length} từ</span>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Danh sách
          </Button>
          <Button
            variant={viewMode === "flashcard" ? "default" : "outline"}
            onClick={() => setViewMode("flashcard")}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Flashcard
          </Button>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="space-y-6">
            {dayData.words.map((word) => (
              <VocabCard
                key={word.id}
                word={word}
                showActions={true}
                mode="study"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Flashcard Mode */}
            <Flashcard
              word={currentWord}
              showActions={true}
              onNext={handleNextWord}
              onPrev={handlePrevWord}
              currentIndex={currentWordIndex}
              totalWords={dayData.words.length}
            />
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevDay}
            disabled={dayNumber <= 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Ngày {dayNumber - 1}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/vocabulary/quiz/${dayNumber}`)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Kiểm tra
            </Button>

            {progress === 100 && (
              <Button
                onClick={handleCompleteDay}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Hoàn thành ngày
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleNextDay}
            disabled={dayNumber >= totalDays}
            className="flex items-center gap-2"
          >
            Ngày {dayNumber + 1}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
