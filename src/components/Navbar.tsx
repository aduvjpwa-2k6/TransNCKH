import React from 'react';
import { Columns, Layout, ArrowLeftRight, Upload, BookOpen, Download, Printer, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenGlossary: () => void;
  onOpenExport: () => void;
  onPrint: () => void;
  layoutMode: 'two_column' | 'single_column' | 'bilingual_split';
  onChangeLayoutMode: (mode: 'two_column' | 'single_column' | 'bilingual_split') => void;
  glossaryCount: number;
  hasPaper: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenGlossary,
  onOpenExport,
  onPrint,
  layoutMode,
  onChangeLayoutMode,
  glossaryCount,
  hasPaper,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-950 text-base tracking-tight font-sans">
                SciPaper Translator
              </span>
              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold rounded border border-indigo-100 uppercase">
                Học Thuật
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-sans hidden sm:block">
              Dịch bài báo khoa học chuẩn format IEEE / Nature sang Tiếng Việt
            </p>
          </div>
        </div>

        {/* Center: Layout Mode Switcher (Visible when paper is loaded) */}
        {hasPaper && (
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => onChangeLayoutMode('two_column')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                layoutMode === 'two_column'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Bố cục 2 cột truyền thống tạp chí IEEE"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Hai cột IEEE</span>
            </button>
            <button
              onClick={() => onChangeLayoutMode('single_column')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                layoutMode === 'single_column'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Bố cục một cột mở rộng dễ đọc"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Một cột</span>
            </button>
            <button
              onClick={() => onChangeLayoutMode('bilingual_split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                layoutMode === 'bilingual_split'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Đối chiếu song ngữ Anh - Việt"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Song ngữ đối chiếu</span>
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {hasPaper && (
            <>
              {/* Glossary Button */}
              <button
                onClick={onOpenGlossary}
                className="relative flex items-center gap-1.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 text-xs font-medium rounded-lg transition-colors border border-stone-200"
                title="Xem bảng thuật ngữ chuyên ngành"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Thuật ngữ</span>
                {glossaryCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                    {glossaryCount}
                  </span>
                )}
              </button>

              {/* Quick Print Button */}
              <button
                onClick={onPrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 text-xs font-medium rounded-lg transition-colors border border-stone-200"
                title="In hoặc lưu file PDF theo trang chuẩn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / PDF</span>
              </button>

              {/* Export Button (LaTeX / Markdown) */}
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 text-xs font-medium rounded-lg transition-colors border border-stone-200"
                title="Tải mã nguồn LaTeX hoặc Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xuất LaTeX/MD</span>
              </button>
            </>
          )}

          {/* Upload New Paper Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{hasPaper ? 'Dịch bài khác' : 'Tải lên bài báo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
