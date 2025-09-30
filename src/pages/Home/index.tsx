import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Target } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎌 Japanese Learning Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Nền tảng học tiếng Nhật toàn diện với nhiều tính năng hấp dẫn
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/vocabulary")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Học từ vựng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Lộ trình học từ vựng 30 ngày với spaced repetition, flashcard và
                quiz
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-purple-600" />
                Ngữ pháp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Học ngữ pháp từ cơ bản đến nâng cao (Sắp ra mắt)
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-green-600" />
                Luyện thi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Luyện thi JLPT N5-N1 với đề thi thực tế (Sắp ra mắt)
              </p>
            </CardContent>
          </Card>
        </div>

        <Button
          size="lg"
          onClick={() => navigate("/vocabulary")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          🚀 Bắt đầu học từ vựng
        </Button>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            ✨ Hoàn toàn miễn phí | 🎯 Không cần đăng ký | 📱 Responsive trên
            mọi thiết bị
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
