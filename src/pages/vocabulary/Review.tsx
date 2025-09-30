import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/components/vocabulary/Flashcard";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { useNavigate } from "react-router-dom";
import {
  RotateCcw,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

interface JapaneseWord {
  id: number;
  hiragana: string;
  kanji: string;
  meaning: string;
  example: string;
}

export const Review = () => {
  const navigate = useNavigate();
  const {
    getWordsByIds,
    loading: vocabularyLoading,
    error: vocabularyError,
  } = useVocabulary();
  const { getWordsNeedingReview, getOverallStats } = useVocabularyStore();

  const [reviewWords, setReviewWords] = useState<JapaneseWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const wordsNeedingReview = getWordsNeedingReview();
  const stats = getOverallStats();

  useEffect(() => {
    if (!vocabularyLoading && !vocabularyError) {
      loadReviewWords();
    }
  }, [vocabularyLoading, vocabularyError, wordsNeedingReview]);

  const loadReviewWords = async () => {
    setLoading(true);
    try {
      if (wordsNeedingReview.length > 0) {
        const words = await getWordsByIds(wordsNeedingReview);
        console.log("Loaded review words:", words.length);
        setReviewWords(words);
      } else {
        setReviewWords([]);
      }
    } catch (error) {
      console.error("Error loading review words:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setReviewedCount(reviewedCount + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestartReview = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
  };

  const handleBackToHome = () => {
    navigate("/vocabulary");
  };

  if (vocabularyLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {vocabularyLoading
              ? "Đang tải dữ liệu từ vựng..."
              : "Đang tải từ cần ôn tập..."}
          </p>
        </div>
      </div>
    );
  }

  if (vocabularyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-red-700">
                <BookOpen className="w-6 h-6" />
                Lỗi tải dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">{vocabularyError}</p>
              <Button
                onClick={() => navigate("/vocabulary")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-orange-700">
                <CheckCircle className="w-6 h-6" />
                Không có từ cần ôn tập!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tuyệt vời! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  Bạn không có từ nào cần ôn tập vào lúc này. Hãy tiếp tục học
                  từ mới hoặc quay lại sau.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-semibold text-green-600">
                    {stats.knownWords}
                  </div>
                  <div className="text-gray-500">Từ đã thuộc</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-semibold text-blue-600">
                    {stats.totalWords}
                  </div>
                  <div className="text-gray-500">Tổng số từ</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleBackToHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/vocabulary/quiz")}
                  className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <BookOpen className="w-4 h-4" />
                  Làm bài kiểm tra
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔄 Ôn tập từ vựng
          </h1>
          <p className="text-gray-600">Ôn lại những từ cần được nhắc nhở</p>
        </div>

        {/* Stats Bar */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-600">
                    {reviewWords.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Từ cần ôn</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {reviewedCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Đã ôn</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    {currentIndex + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Hiện tại</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-600">
                    {Math.round(
                      ((currentIndex + 1) / reviewWords.length) * 100
                    )}
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500">Tiến độ</p>
              </div>
            </div>

            <div className="mt-4">
              <Progress
                value={((currentIndex + 1) / reviewWords.length) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Review Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">
            Chế độ ôn tập - Tập trung vào từ cần nhớ lại
          </Badge>
        </div>

        {/* Flashcard */}
        <div className="mb-6">
          <Flashcard
            word={reviewWords[currentIndex]}
            showActions={true}
            onNext={handleNext}
            onPrev={handlePrev}
            currentIndex={currentIndex}
            totalWords={reviewWords.length}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={handleRestartReview}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Bắt đầu lại
          </Button>

          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/vocabulary/quiz")}
            className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <BookOpen className="w-4 h-4" />
            Chuyển sang kiểm tra
          </Button>
        </div>

        {/* Completion Message */}
        {currentIndex === reviewWords.length - 1 && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-green-800 mb-2">
                🎉 Hoàn thành ôn tập!
              </h3>
              <p className="text-green-700 text-sm">
                Bạn đã ôn tập xong {reviewWords.length} từ. Hãy tiếp tục duy trì
                momentum!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
