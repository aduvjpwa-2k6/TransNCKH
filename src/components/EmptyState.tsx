import React from 'react';
import { SAMPLE_PAPERS, SamplePaper } from '../data/samplePapers';
import { Upload, Sparkles, BookOpen, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onOpenUpload: () => void;
  onSelectSample: (sample: SamplePaper) => void;
  isTranslating: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenUpload,
  onSelectSample,
  isTranslating,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-12">
      {/* Hero Presentation */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ thống chuyển dịch tài liệu khoa học chuẩn mực quốc tế</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-stone-950 tracking-tight leading-tight max-w-3xl mx-auto">
          Dịch Bài Báo Khoa Học Sang Tiếng Việt Giữ Trọn Format Gốc
        </h1>

        <p className="text-sm sm:text-base text-stone-600 font-sans max-w-2xl mx-auto leading-relaxed">
          Tải lên tài liệu PDF hoặc văn bản học thuật. Hệ thống sẽ tự động phân tích cấu trúc, giữ nguyên định dạng hai cột, chuẩn hóa thuật ngữ chuyên ngành và bảo lưu tuyệt đối mọi công thức toán học LaTeX.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onOpenUpload}
            disabled={isTranslating}
            className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-3 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Tải lên tài liệu bài báo (PDF / DOCX / TeX)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <span className="font-mono text-sm">∑∫</span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm font-sans">Bảo Toàn Công Thức LaTeX</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans">
            Mọi phương trình toán học $x_i$, ma trận, chỉ số vector và hàm số đều được kết xuất nguyên vẹn bằng KaTeX chuẩn mực.
          </p>
        </div>

        <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm font-sans">Bố Cục Tạp Chí Hai Cột</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans">
            Tái hiện chính xác cấu trúc bài báo quốc tế (IEEE, Nature, ACM) gồm Tiêu đề, Tác giả, Abstract, Bảng biểu và Trích dẫn [1].
          </p>
        </div>

        <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm font-sans">Xuất Mã LaTeX & PDF</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans">
            Tải về tệp nguồn <code className="text-amber-800 font-mono">.tex</code> sẵn sàng biên dịch trên Overleaf hoặc in trực tiếp ra tệp PDF trang in hoàn chỉnh.
          </p>
        </div>
      </div>

      {/* 1-Click Sample Testing Section */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-900 text-base font-sans">
              Thử Nghiệm Nhanh Với Bài Báo Mẫu (1-Click Test)
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Chọn một bài báo kinh điển dưới đây để trải nghiệm ngay quy trình dịch thuật học thuật chuẩn mực:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLE_PAPERS.map(sample => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="p-5 bg-white border border-stone-200 hover:border-indigo-500/80 hover:shadow-md rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="inline-block text-[10.5px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-sans">
                  {sample.domain}
                </span>
                <h3 className="font-bold font-serif text-stone-900 text-sm group-hover:text-indigo-700 transition-colors">
                  {sample.title}
                </h3>
                <p className="text-xs text-stone-500 font-sans line-clamp-3">
                  {sample.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400">{sample.year}</span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Dịch thử ngay
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
