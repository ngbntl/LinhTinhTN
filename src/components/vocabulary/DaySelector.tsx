import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock } from "lucide-react";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  totalDays: number;
  onDaySelect: (day: number) => void;
}

export const DaySelector = ({ totalDays, onDaySelect }: DaySelectorProps) => {
  const { currentDay, completedDays, getOverallStats } = useVocabularyStore();
  const stats = getOverallStats();

  const getDayStatus = (day: number) => {
    if (completedDays.includes(day)) return "completed";
    if (day === currentDay) return "current";
    if (day <= currentDay) return "available";
    return "locked";
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "current":
        return "bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-300";
      case "available":
        return "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200";
      case "locked":
        return "bg-gray-100 text-gray-400 cursor-not-allowed";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  const getProgressForDay = (day: number) => {
    // Tính toán tiến độ cho ngày cụ thể (giả định)
    // Trong thực tế, bạn cần tính toán dựa trên wordProgress
    if (completedDays.includes(day)) return 100;
    if (day === currentDay) return Math.floor(Math.random() * 80); // Demo progress
    return 0;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📅 Chọn ngày học
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tiến độ: {completedDays.length}/{totalDays} ngày (
              {Math.round((completedDays.length / totalDays) * 100)}%)
            </p>
            <div className="text-sm text-gray-500">
              Từ đã thuộc: {stats.knownWords}/{stats.totalWords}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3 mb-6">
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const status = getDayStatus(day);
            const progress = getProgressForDay(day);
            const isClickable = status !== "locked";

            return (
              <div key={day} className="relative">
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full h-16 flex flex-col items-center justify-center relative transition-all duration-200",
                    getDayColor(status)
                  )}
                  onClick={() => isClickable && onDaySelect(day)}
                  disabled={!isClickable}
                >
                  {status === "completed" && (
                    <Check className="absolute top-1 right-1 w-3 h-3" />
                  )}
                  {status === "locked" && (
                    <Lock className="absolute top-1 right-1 w-3 h-3" />
                  )}

                  <span className="font-semibold text-sm">{day}</span>

                  {progress > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className="w-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
              <Check className="w-2 h-2 text-white" />
            </div>
            <span>Đã hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-300"></div>
            <span>Đang học</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span>Có thể học</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
              <Lock className="w-2 h-2 text-gray-400" />
            </div>
            <span>Chưa mở khóa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
