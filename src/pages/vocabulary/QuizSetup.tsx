import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Play,
  Home,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Shuffle,
  Target,
  Filter,
} from "lucide-react";

interface QuizConfig {
  selectedDays: number[];
  questionCount: number;
  questionTypes: string[];
  difficulty: "all" | "learned" | "unlearned" | "review";
  timeLimit?: number;
}

export const QuizSetup = () => {
  const navigate = useNavigate();
  const {
    getAllDays,
    getDayData,
    loading: vocabularyLoading,
    error: vocabularyError,
  } = useVocabulary();
  const { completedDays, getOverallStats, wordProgress } = useVocabularyStore();

  const [config, setConfig] = useState<QuizConfig>({
    selectedDays: [],
    questionCount: 10,
    questionTypes: [
      "hiragana-to-meaning",
      "kanji-to-hiragana",
      "meaning-to-hiragana",
      "kanji-to-meaning",
    ],
    difficulty: "all",
  });

  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedWordsCount, setSelectedWordsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const stats = getOverallStats();
  const allDays = getAllDays();

  useEffect(() => {
    if (!vocabularyLoading && !vocabularyError) {
      loadAvailableDays();
    }
  }, [vocabularyLoading, vocabularyError, completedDays]);

  useEffect(() => {
    calculateSelectedWordsCount();
  }, [config.selectedDays, config.difficulty]);

  const loadAvailableDays = () => {
    setLoading(true);
    try {
      setAvailableDays(allDays);
      // Mặc định chọn các ngày đã hoàn thành
      if (completedDays.length > 0) {
        setConfig((prev) => ({
          ...prev,
          selectedDays: [...completedDays],
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateSelectedWordsCount = () => {
    let totalWords = 0;

    config.selectedDays.forEach((day) => {
      const dayData = getDayData(day);
      if (dayData) {
        const dayWords = dayData.words;

        switch (config.difficulty) {
          case "learned":
            totalWords += dayWords.filter(
              (word) => wordProgress[word.id]?.known === true
            ).length;
            break;
          case "unlearned":
            totalWords += dayWords.filter(
              (word) =>
                !wordProgress[word.id] || wordProgress[word.id]?.known === false
            ).length;
            break;
          case "review":
            totalWords += dayWords.filter(
              (word) => wordProgress[word.id] && !wordProgress[word.id]?.known
            ).length;
            break;
          default:
            totalWords += dayWords.length;
        }
      }
    });

    setSelectedWordsCount(totalWords);
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      selectedDays: checked
        ? [...prev.selectedDays, day]
        : prev.selectedDays.filter((d) => d !== day),
    }));
  };

  const handleSelectAllDays = () => {
    setConfig((prev) => ({
      ...prev,
      selectedDays: availableDays,
    }));
  };

  const handleSelectLearnedDays = () => {
    setConfig((prev) => ({
      ...prev,
      selectedDays: [...completedDays],
    }));
  };

  const handleClearDays = () => {
    setConfig((prev) => ({
      ...prev,
      selectedDays: [],
    }));
  };

  const handleQuestionTypeToggle = (type: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      questionTypes: checked
        ? [...prev.questionTypes, type]
        : prev.questionTypes.filter((t) => t !== type),
    }));
  };

  const handleStartQuiz = () => {
    if (config.selectedDays.length === 0) {
      alert("Vui lòng chọn ít nhất một ngày để kiểm tra!");
      return;
    }

    if (config.questionTypes.length === 0) {
      alert("Vui lòng chọn ít nhất một dạng câu hỏi!");
      return;
    }

    if (selectedWordsCount === 0) {
      alert("Không có từ nào phù hợp với cấu hình đã chọn!");
      return;
    }

    // Lưu config vào localStorage hoặc state để Quiz component sử dụng
    localStorage.setItem("quizConfig", JSON.stringify(config));
    navigate("/vocabulary/quiz");
  };

  if (vocabularyLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (vocabularyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-red-200">
            <CardContent className="p-6">
              <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                Lỗi tải dữ liệu
              </h3>
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

  const questionTypeOptions = [
    { value: "hiragana-to-meaning", label: "Hiragana → Nghĩa", icon: "ひ→📝" },
    { value: "kanji-to-hiragana", label: "Kanji → Hiragana", icon: "漢→ひ" },
    { value: "meaning-to-hiragana", label: "Nghĩa → Hiragana", icon: "📝→ひ" },
    { value: "kanji-to-meaning", label: "Kanji → Nghĩa", icon: "漢→📝" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚙️ Tạo đề kiểm tra
          </h1>
          <p className="text-gray-600">
            Tùy chỉnh bài kiểm tra theo ngày học hoặc từ đã học
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Config */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Chọn ngày học ({config.selectedDays.length} ngày)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllDays}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Chọn tất cả ({availableDays.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectLearnedDays}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Ngày đã học ({completedDays.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearDays}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto">
                  {availableDays.map((day) => {
                    const isCompleted = completedDays.includes(day);
                    const isSelected = config.selectedDays.includes(day);
                    const dayData = getDayData(day);
                    const wordCount = dayData?.words.length || 0;

                    return (
                      <div key={day} className="relative">
                        <div
                          className={`
                            w-full h-12 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-500 text-white"
                                : isCompleted
                                ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }
                          `}
                          onClick={() => handleDayToggle(day, !isSelected)}
                        >
                          <span className="font-semibold">{day}</span>
                          <span className="text-xs opacity-75">
                            {wordCount}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Question Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Dạng câu hỏi ({config.questionTypes.length}/4)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {questionTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={option.value}
                        checked={config.questionTypes.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleQuestionTypeToggle(
                            option.value,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Cài đặt bài kiểm tra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="questionCount">Số câu hỏi</Label>
                    <Select
                      value={config.questionCount.toString()}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          questionCount: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 câu</SelectItem>
                        <SelectItem value="10">10 câu</SelectItem>
                        <SelectItem value="15">15 câu</SelectItem>
                        <SelectItem value="20">20 câu</SelectItem>
                        <SelectItem value="30">30 câu</SelectItem>
                        <SelectItem value="50">50 câu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Độ khó</Label>
                    <Select
                      value={config.difficulty}
                      onValueChange={(
                        value: "all" | "learned" | "unlearned" | "review"
                      ) =>
                        setConfig((prev) => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả từ</SelectItem>
                        <SelectItem value="learned">Từ đã thuộc</SelectItem>
                        <SelectItem value="unlearned">Từ chưa thuộc</SelectItem>
                        <SelectItem value="review">Từ cần ôn tập</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary & Actions */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-orange-600" />
                  Tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày đã chọn:</span>
                    <Badge variant="outline">
                      {config.selectedDays.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Từ khả dụng:</span>
                    <Badge variant="outline">{selectedWordsCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số câu hỏi:</span>
                    <Badge variant="outline">
                      {Math.min(config.questionCount, selectedWordsCount)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dạng câu hỏi:</span>
                    <Badge variant="outline">
                      {config.questionTypes.length}
                    </Badge>
                  </div>
                </div>

                {selectedWordsCount < config.questionCount &&
                  selectedWordsCount > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700">
                        ⚠️ Chỉ có {selectedWordsCount} từ khả dụng, ít hơn{" "}
                        {config.questionCount} câu hỏi yêu cầu.
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Overall Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tiến độ tổng thể</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">
                      {stats.totalWords}
                    </div>
                    <div className="text-xs text-gray-500">Tổng từ</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-600">
                      {stats.knownWords}
                    </div>
                    <div className="text-xs text-gray-500">Đã thuộc</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartQuiz}
                disabled={
                  config.selectedDays.length === 0 || selectedWordsCount === 0
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu kiểm tra
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/vocabulary")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/vocabulary/quiz")}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Kiểm tra ngẫu nhiên
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
