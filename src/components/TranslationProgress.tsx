import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, FileText, Cpu, Calculator, BookOpen } from 'lucide-react';

interface TranslationProgressProps {
  fileName?: string;
}

export const TranslationProgress: React.FC<TranslationProgressProps> = ({ fileName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Phân tích cấu trúc bài báo', desc: 'Đọc tiêu đề, tác giả, Abstract và phân đoạn các phần (Sections)...', icon: FileText },
    { title: 'Trích xuất & Bảo lưu công thức LaTeX', desc: 'Nhận diện các phương trình toán học $...$ và ma trận số học...', icon: Calculator },
    { title: 'Dịch thuật học thuật chuyên ngành', desc: 'Chuẩn hóa thuật ngữ khoa học sang Tiếng Việt chuẩn mực...', icon: Cpu },
    { title: 'Định dạng Bảng biểu & Bố cục Tạp chí', desc: 'Tái tạo định dạng hai cột IEEE/Nature và danh mục trích dẫn...', icon: BookOpen },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 2500);
    const timer2 = setTimeout(() => setCurrentStep(2), 5500);
    const timer3 = setTimeout(() => setCurrentStep(3), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-8">
      {/* Animated Spinner Icon */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-stone-900 font-sans">
          Đang Xử Lý & Chuyển Dịch Bài Báo Khoa Học
        </h2>
        {fileName && (
          <p className="text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 inline-block px-3 py-1 rounded-full">
            Tài liệu: {fileName}
          </p>
        )}
        <p className="text-xs text-stone-500 font-sans max-w-md mx-auto">
          Hệ thống AI Gemini đang bảo toàn 100% định dạng, công thức toán LaTeX và các bảng dữ liệu gốc.
        </p>
      </div>

      {/* Steps List */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs text-left space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                isCurrent ? 'bg-indigo-50/60 border border-indigo-100' : ''
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-stone-300" />
                )}
              </div>
              <div>
                <h4
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-indigo-900' : isDone ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-stone-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
