import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DaySelector } from "@/components/vocabulary/DaySelector";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useVocabularyStore } from "@/store/vocabularyStore";
import {
  BookOpen,
  Target,
  Award,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const { loading, error, getTotalDays, uploadExcelFile } = useVocabulary();
  const {
    completedDays,
    currentDay,
    setCurrentDay,
    resetProgress,
    getOverallStats,
    studyMode,
    setStudyMode,
    showFurigana,
    toggleFurigana,
  } = useVocabularyStore();

  const [showReset, setShowReset] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const totalDays = getTotalDays();
  const stats = getOverallStats();

  const handleDaySelect = (day: number) => {
    setCurrentDay(day);
    navigate(`/vocabulary/day/${day}`);
  };

  const handleResetProgress = () => {
    resetProgress();
    setShowReset(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    setUploadingFile(true);
    try {
      await uploadExcelFile(file);
      alert("Upload file Excel thành công!");
    } catch (error) {
      alert("Lỗi khi upload file: " + (error as Error).message);
    } finally {
      setUploadingFile(false);
      event.target.value = ""; // Reset input
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu từ vựng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto border-red-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Vui lòng upload file Excel mới:
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploadingFile}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🇯🇵 Học từ vựng tiếng Nhật
          </h1>
          <p className="text-xl text-gray-600">
            Lộ trình học từ vựng với spaced repetition
          </p>
        </div>

        {/* Settings Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cài đặt học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chế độ hiển thị:
                </label>
                <Select
                  value={studyMode}
                  onValueChange={(value: "hiragana" | "kanji" | "mixed") =>
                    setStudyMode(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Hiragana + Kanji</SelectItem>
                    <SelectItem value="hiragana">Chỉ Hiragana</SelectItem>
                    <SelectItem value="kanji">Chỉ Kanji</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Furigana:
                </label>
                <Button
                  variant="outline"
                  onClick={toggleFurigana}
                  className="w-full justify-start"
                >
                  {showFurigana ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2" />
                  )}
                  {showFurigana ? "Hiện" : "Ẩn"} furigana
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Upload file Excel:
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiến độ tổng
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.knownWords}/{stats.totalWords} từ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ngày đã học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedDays.length}</div>
              <p className="text-xs text-muted-foreground">
                trên {totalDays} ngày
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Từ đã thuộc</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.knownWords}
              </div>
              <p className="text-xs text-muted-foreground">
                Cần ôn: {stats.reviewWords}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ngày hiện tại
              </CardTitle>
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ngày {currentDay}</div>
              <p className="text-xs text-muted-foreground">
                Trung bình: {stats.averageReviewCount} lần ôn/từ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Day Selector */}
        <div className="mb-8">
          <DaySelector totalDays={totalDays} onDaySelect={handleDaySelect} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button
            size="lg"
            onClick={() => navigate(`/vocabulary/day/${currentDay}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            📚 Học ngày {currentDay}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/vocabulary/review")}
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            🔄 Ôn tập ({stats.reviewWords})
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/vocabulary/flashcard")}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            🧠 Flashcard
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/vocabulary/quiz-setup")}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            ⚙️ Tạo đề kiểm tra
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/vocabulary/quiz")}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            ❓ Kiểm tra ngẫu nhiên
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowReset(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset tiến độ
          </Button>
        </div>

        {/* Study Mode Badges */}
        <div className="flex justify-center gap-2 mb-6">
          <Badge variant="outline" className="px-3 py-1">
            Chế độ:{" "}
            {studyMode === "mixed"
              ? "Hiragana + Kanji"
              : studyMode === "hiragana"
              ? "Hiragana"
              : "Kanji"}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Furigana: {showFurigana ? "Hiện" : "Ẩn"}
          </Badge>
        </div>

        {/* Reset Confirmation */}
        {showReset && (
          <Card className="max-w-md mx-auto border-red-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">
                Xác nhận reset tiến độ
              </h3>
              <p className="text-gray-600 mb-4">
                Bạn có chắc muốn xóa toàn bộ tiến độ học? Hành động này không
                thể hoàn tác.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setShowReset(false)}>
                  Hủy
                </Button>
                <Button variant="destructive" onClick={handleResetProgress}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Quote */}
        <div className="text-center text-gray-600 italic">
          <p>
            "日本語を学ぶことは新しい世界への扉を開くことです" - "Học tiếng Nhật
            là mở cánh cửa đến thế giới mới"
          </p>
        </div>
      </div>
    </div>
  );
};
