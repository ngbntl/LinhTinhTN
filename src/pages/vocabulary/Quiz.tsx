import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  Trophy,
  Clock,
  Target,
  BookOpen,
  Shuffle,
  Settings,
} from "lucide-react";

interface JapaneseWord {
  id: number;
  hiragana: string;
  kanji: string;
  meaning: string;
  example: string;
}

interface QuizQuestion {
  word: JapaneseWord;
  question: string;
  correctAnswer: string;
  options: string[];
  type:
    | "hiragana-to-meaning"
    | "kanji-to-hiragana"
    | "meaning-to-hiragana"
    | "kanji-to-meaning";
}

interface QuizResult {
  questionIndex: number;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  word: JapaneseWord;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const {
    getAllWords,
    getFilteredWords,
    loading: vocabularyLoading,
    error: vocabularyError,
  } = useVocabulary();
  const { markWordKnown, wordProgress } = useVocabularyStore();

  const [allWords, setAllWords] = useState<JapaneseWord[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizConfig, setQuizConfig] = useState({
    selectedDays: [] as number[],
    questionCount: 10,
    questionTypes: [
      "hiragana-to-meaning",
      "kanji-to-hiragana",
      "meaning-to-hiragana",
      "kanji-to-meaning",
    ],
    difficulty: "all" as "all" | "learned" | "unlearned" | "review",
  });

  useEffect(() => {
    // Load quiz config from localStorage if available
    const savedConfig = localStorage.getItem("quizConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setQuizConfig(config);
        localStorage.removeItem("quizConfig"); // Remove after use
      } catch (error) {
        console.error("Error parsing quiz config:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Chỉ load words khi vocabulary data đã sẵn sàng
    if (!vocabularyLoading && !vocabularyError) {
      loadWords();
    }
  }, [vocabularyLoading, vocabularyError, quizConfig]);

  const loadWords = async () => {
    setLoading(true);
    try {
      let words: JapaneseWord[] = [];

      if (quizConfig.selectedDays.length > 0) {
        // Use filtered words based on config
        words = getFilteredWords(
          quizConfig.selectedDays,
          quizConfig.difficulty,
          wordProgress
        );
        console.log(
          `Loaded ${
            words.length
          } filtered words for quiz from days: ${quizConfig.selectedDays.join(
            ", "
          )}`
        );
      } else {
        // Fallback to all words
        words = await getAllWords();
        console.log("Loaded all words for quiz:", words.length);
      }

      setAllWords(words);
      if (words.length > 0) {
        generateQuiz(words);
      }
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = (words: JapaneseWord[]) => {
    if (words.length === 0) return;

    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const questionCount = Math.min(quizConfig.questionCount, words.length);
    const selectedWords = shuffledWords.slice(0, questionCount);

    const quizQuestions: QuizQuestion[] = selectedWords.map((word) => {
      const availableTypes =
        quizConfig.questionTypes.length > 0
          ? quizConfig.questionTypes
          : ["hiragana-to-meaning"];

      const questionType = availableTypes[
        Math.floor(Math.random() * availableTypes.length)
      ] as QuizQuestion["type"];

      return generateQuestion(word, words, questionType);
    });

    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setIsQuizComplete(false);
  };

  const generateQuestion = (
    word: JapaneseWord,
    allWords: JapaneseWord[],
    type: QuizQuestion["type"]
  ): QuizQuestion => {
    const otherWords = allWords.filter((w) => w.id !== word.id);
    const randomWords = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);

    switch (type) {
      case "hiragana-to-meaning":
        return {
          word,
          question: `"${word.hiragana}" có nghĩa là gì?`,
          correctAnswer: word.meaning,
          options: [word.meaning, ...randomWords.map((w) => w.meaning)].sort(
            () => Math.random() - 0.5
          ),
          type,
        };

      case "kanji-to-hiragana":
        return {
          word,
          question: `Cách đọc của "${word.kanji || word.hiragana}" là gì?`,
          correctAnswer: word.hiragana,
          options: [word.hiragana, ...randomWords.map((w) => w.hiragana)].sort(
            () => Math.random() - 0.5
          ),
          type,
        };

      case "meaning-to-hiragana":
        return {
          word,
          question: `"${word.meaning}" được viết bằng Hiragana như thế nào?`,
          correctAnswer: word.hiragana,
          options: [word.hiragana, ...randomWords.map((w) => w.hiragana)].sort(
            () => Math.random() - 0.5
          ),
          type,
        };

      case "kanji-to-meaning":
        return {
          word,
          question: `"${word.kanji || word.hiragana}" có nghĩa là gì?`,
          correctAnswer: word.meaning,
          options: [word.meaning, ...randomWords.map((w) => w.meaning)].sort(
            () => Math.random() - 0.5
          ),
          type,
        };

      default:
        return generateQuestion(word, allWords, "hiragana-to-meaning");
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const result: QuizResult = {
      questionIndex: currentQuestionIndex,
      correct: isCorrect,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      word: currentQuestion.word,
    };

    setQuizResults((prev) => [...prev, result]);

    // Update word progress based on quiz result
    if (isCorrect) {
      markWordKnown(currentQuestion.word.id, true, "easy");
    } else {
      markWordKnown(currentQuestion.word.id, false);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    generateQuiz(allWords);
    setShowResult(false);
    setSelectedAnswer("");
  };

  const handleCreateNewQuiz = () => {
    navigate("/vocabulary/quiz-setup");
  };

  const calculateScore = () => {
    const correctCount = quizResults.filter((r) => r.correct).length;
    return {
      correct: correctCount,
      total: quizResults.length,
      percentage: Math.round((correctCount / quizResults.length) * 100),
    };
  };

  // Show loading state while vocabulary is loading OR quiz is loading
  if (vocabularyLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {vocabularyLoading
              ? "Đang tải dữ liệu từ vựng..."
              : "Đang chuẩn bị bài kiểm tra..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if vocabulary failed to load
  if (vocabularyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
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

  // Show no data message only after loading is complete
  if (allWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-purple-200">
            <CardContent className="p-6">
              <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {quizConfig.selectedDays.length > 0
                  ? "Không có từ phù hợp"
                  : "Chưa có dữ liệu từ vựng"}
              </h3>
              <p className="text-gray-600 mb-4">
                {quizConfig.selectedDays.length > 0
                  ? `Không tìm thấy từ nào phù hợp với cấu hình: ${quizConfig.selectedDays.length} ngày, độ khó "${quizConfig.difficulty}".`
                  : "Vui lòng tải dữ liệu từ vựng trước khi làm bài kiểm tra."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => navigate("/vocabulary")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateNewQuiz}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Tạo đề mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-purple-700">
                <Trophy className="w-6 h-6" />
                Kết quả bài kiểm tra
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Score Summary */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {score.percentage}%
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {score.percentage >= 80
                    ? "Xuất sắc! 🎉"
                    : score.percentage >= 60
                    ? "Tốt! 👍"
                    : "Cần cố gắng thêm! 💪"}
                </h3>
                <p className="text-gray-600">
                  Bạn trả lời đúng {score.correct}/{score.total} câu hỏi
                </p>

                {/* Quiz Config Info */}
                {quizConfig.selectedDays.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📊 Kiểm tra từ {quizConfig.selectedDays.length} ngày (
                      {quizConfig.selectedDays.slice(0, 5).join(", ")}
                      {quizConfig.selectedDays.length > 5 ? "..." : ""}) • Độ
                      khó:{" "}
                      {quizConfig.difficulty === "all"
                        ? "Tất cả"
                        : quizConfig.difficulty === "learned"
                        ? "Đã thuộc"
                        : quizConfig.difficulty === "unlearned"
                        ? "Chưa thuộc"
                        : "Cần ôn tập"}
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed Results */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {quizResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.correct
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {result.correct ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium">Câu {index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {questions[result.questionIndex]?.question}
                        </p>
                        <div className="text-xs">
                          <span className="text-gray-500">Đáp án đúng: </span>
                          <span className="font-medium text-green-600">
                            {result.correctAnswer}
                          </span>
                          {!result.correct && (
                            <>
                              <span className="text-gray-500 ml-2">
                                Bạn chọn:{" "}
                              </span>
                              <span className="font-medium text-red-600">
                                {result.selectedAnswer}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateNewQuiz}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Tạo đề mới
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/vocabulary")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/vocabulary/review")}
                  className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <BookOpen className="w-4 h-4" />
                  Ôn tập
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ❓ Kiểm tra từ vựng
          </h1>
          <p className="text-gray-600">
            Kiểm tra khả năng ghi nhớ từ vựng của bạn
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </span>
              <Badge className="bg-purple-100 text-purple-800">
                {Math.round(
                  ((currentQuestionIndex + 1) / questions.length) * 100
                )}
                %
              </Badge>
            </div>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {currentQuestion.question}
              </h2>

              {/* Show word example if available */}
              {currentQuestion.word.example && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Ví dụ:</p>
                  <p className="text-gray-800">
                    {currentQuestion.word.example}
                  </p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 h-auto text-left justify-start ${
                    selectedAnswer === option
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "hover:bg-purple-50 border-purple-200"
                  } ${showResult ? "pointer-events-none" : ""}`}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        selectedAnswer === option
                          ? "border-white text-white"
                          : "border-purple-300 text-purple-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base">{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`font-semibold ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? "Chính xác!"
                      : "Sai rồi!"}
                  </span>
                </div>
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <p className="text-sm text-gray-600">
                    Đáp án đúng:{" "}
                    <span className="font-medium text-green-600">
                      {currentQuestion.correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-8"
                >
                  Xác nhận
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="px-8">
                  {currentQuestionIndex < questions.length - 1
                    ? "Câu tiếp theo"
                    : "Xem kết quả"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-purple-200">
            <CardContent className="p-3 text-center">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">
                {quizResults.filter((r) => r.correct).length}
              </div>
              <div className="text-xs text-gray-500">Đúng</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-3 text-center">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{quizResults.length}</div>
              <div className="text-xs text-gray-500">Đã làm</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-3 text-center">
              <Shuffle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{questions.length}</div>
              <div className="text-xs text-gray-500">Tổng câu</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
