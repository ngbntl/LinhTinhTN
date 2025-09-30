import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVocabulary } from '@/hooks/useVocabulary';
import { ExcelReader, ExcelProcessingOptions } from '@/utils/excelReader';

export const DebugExcel: React.FC = () => {
  const { data, loading, error } = useVocabulary();
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [processingOptions, setProcessingOptions] = useState<ExcelProcessingOptions>({
    removeDuplicates: true,
    skipEmptyRows: true,
    autoDetectColumns: true
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    try {
      console.log('Reading file with options:', processingOptions);
      const rawData = await ExcelReader.readVocabularyFile(file, {
        ...processingOptions,
        removeDuplicates: false // Đọc raw data trước
      });
      console.log('Raw data from Excel:', rawData);

      const duplicateAnalysis = ExcelReader.analyzeDuplicates(rawData);
      console.log('Duplicate analysis:', duplicateAnalysis);

      const cleanData = processingOptions.removeDuplicates 
        ? ExcelReader.removeDuplicateWords(rawData)
        : rawData;
      console.log('Processed data:', cleanData);

      setUploadedData({ raw: rawData, clean: cleanData });
      setAnalysis({
        ...duplicateAnalysis,
        processingOptions
      });
    } catch (error) {
      console.error('Error reading Excel file:', error);
      alert(`Lỗi đọc file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  const exportCurrentData = () => {
    const jsonString = ExcelReader.exportToJSON(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const createSampleFile = () => {
    ExcelReader.createSampleExcel();
    alert('File mẫu "sample_vocabulary.xlsx" đã được tạo!');
  };

  const exportProcessedData = () => {
    if (!uploadedData) return;
    
    const dataToExport = uploadedData.clean || uploadedData.raw;
    const jsonString = ExcelReader.exportToJSON(dataToExport);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_vocabulary_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-4">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Excel Debug Tool</h1>
        <p className="text-gray-600">Công cụ phân tích và xử lý file Excel từ vựng</p>
      </div>

      {/* Processing Options */}
      <Card>
        <CardHeader>
          <CardTitle>Tùy chọn xử lý dữ liệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={processingOptions.removeDuplicates}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  removeDuplicates: e.target.checked
                })}
              />
              <span>Loại bỏ từ trùng lặp</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={processingOptions.skipEmptyRows}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  skipEmptyRows: e.target.checked
                })}
              />
              <span>Bỏ qua dòng trống</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={processingOptions.autoDetectColumns}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  autoDetectColumns: e.target.checked
                })}
              />
              <span>Tự động phát hiện cột</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload & Test File Excel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn file Excel để phân tích:
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={processing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {processing && <p className="text-sm text-blue-600 mt-2">Đang xử lý file...</p>}
          </div>

          <div className="flex gap-2">
            <Button onClick={createSampleFile} variant="outline" size="sm">
              Tạo file Excel mẫu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Data Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu hiện tại (data.xlsx)</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">Lỗi tải dữ liệu:</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{Object.keys(data).length}</div>
                  <div className="text-sm text-blue-800">Tổng số ngày</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(data).reduce((sum, day) => sum + day.words.length, 0)}
                  </div>
                  <div className="text-sm text-green-800">Tổng số từ vựng</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(data).length > 0 
                      ? Math.round(Object.values(data).reduce((sum, day) => sum + day.words.length, 0) / Object.keys(data).length)
                      : 0
                    }
                  </div>
                  <div className="text-sm text-purple-800">Từ/ngày (TB)</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Chi tiết theo ngày:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(data).map(([dayKey, dayData]) => (
                    <div key={dayKey} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="font-medium text-sm">{dayKey}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {dayData.words.length} từ
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={exportCurrentData} variant="outline">
                Export dữ liệu hiện tại (JSON)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Phân tích file upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">{analysis.totalWords}</div>
                  <div className="text-xs text-blue-800">Tổng từ</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">{analysis.uniqueWords}</div>
                  <div className="text-xs text-green-800">Từ duy nhất</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-red-600">{analysis.duplicates}</div>
                  <div className="text-xs text-red-800">Từ trùng</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {Math.round((analysis.duplicates / analysis.totalWords) * 100)}%
                  </div>
                  <div className="text-xs text-yellow-800">Tỷ lệ trùng</div>
                </div>
              </div>

              {Object.keys(analysis.duplicatesByDay).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Trùng lặp theo ngày:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(analysis.duplicatesByDay).map(([day, count]) => (
                      <div key={day} className="flex justify-between items-center bg-white p-2 rounded text-sm">
                        <span>{day}</span>
                        <Badge variant={count > 0 ? "destructive" : "secondary"}>
                          {count as number}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.duplicateDetails && analysis.duplicateDetails.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Chi tiết từ trùng lặp:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {analysis.duplicateDetails.slice(0, 10).map((detail: any, idx: number) => (
                      <div key={idx} className="text-sm bg-white p-2 rounded">
                        <span className="font-medium">{detail.word}</span>
                        <span className="text-gray-600 ml-2">
                          (xuất hiện ở: {detail.occurrences.join(', ')})
                        </span>
                      </div>
                    ))}
                    {analysis.duplicateDetails.length > 10 && (
                      <p className="text-sm text-gray-500 italic">
                        ... và {analysis.duplicateDetails.length - 10} từ trùng khác
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Data Preview */}
      {uploadedData && (
        <Card>
          <CardHeader>
            <CardTitle>Preview dữ liệu upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Raw Data */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  Dữ liệu thô
                  <Badge variant="outline">Original</Badge>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                  {Object.entries(uploadedData.raw).map(([dayKey, dayData]: [string, any]) => (
                    <div key={dayKey} className="bg-white p-3 rounded border">
                      <div className="font-medium text-sm mb-1">{dayKey}: {dayData.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{dayData.words.length} từ</div>
                      <div className="space-y-1 text-xs">
                        {dayData.words.slice(0, 2).map((word: any, idx: number) => (
                          <div key={idx} className="truncate">
                            {word.hiragana} ({word.kanji}) - {word.meaning}
                          </div>
                        ))}
                        {dayData.words.length > 2 && (
                          <div className="text-gray-500">... +{dayData.words.length - 2} từ</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Data */}
              {processingOptions.removeDuplicates && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    Dữ liệu đã xử lý
                    <Badge variant="outline">Cleaned</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(uploadedData.clean).map(([dayKey, dayData]: [string, any]) => (
                      <div key={dayKey} className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm">{dayKey}: {dayData.title}</div>
                        <div className="text-xs text-gray-600">{dayData.words.length} từ (unique)</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={exportProcessedData} variant="outline">
                  Export dữ liệu đã xử lý (JSON)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};