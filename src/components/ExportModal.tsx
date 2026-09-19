import React, { useState } from 'react';
import { TranslatedPaper } from '../types';
import { generateLaTeX, generateMarkdown, downloadFile } from '../utils/exportUtils';
import { Download, FileCode, FileText, Printer, X, Copy, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: TranslatedPaper;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, paper }) => {
  const [activeTab, setActiveTab] = useState<'latex' | 'markdown' | 'print'>('latex');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const latexCode = generateLaTeX(paper);
  const markdownCode = generateMarkdown(paper);

  const handleDownloadLaTeX = () => {
    downloadFile(
      `${paper.metadata.titleOriginal.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_vi.tex`,
      latexCode,
      'text/x-tex'
    );
  };

  const handleDownloadMarkdown = () => {
    downloadFile(
      `${paper.metadata.titleOriginal.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_vi.md`,
      markdownCode,
      'text/markdown'
    );
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">Xuất Bản & Định Dạng Bài Báo</h2>
              <p className="text-xs text-stone-500">Tải về tệp LaTeX biên dịch, Markdown chuẩn hoặc in ấn PDF theo chuẩn học thuật</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white">
          <button
            onClick={() => setActiveTab('latex')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'latex'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Mã nguồn LaTeX (.tex IEEEtran)
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'markdown'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Tệp Markdown (.md)
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'print'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Printer className="w-4 h-4" />
            In ấn & Lưu PDF trực tiếp
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'latex' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Mã nguồn LaTeX chuẩn lớp tài liệu <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-indigo-700">{"\\documentclass[journal]{IEEEtran}"}</code>, hỗ trợ sẵn gói tiếng Việt babel và công thức amsmath. Có thể đưa thẳng lên <strong>Overleaf</strong> hoặc TeXStudio.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(latexCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã sao chép' : 'Sao chép mã'}
                  </button>
                  <button
                    onClick={handleDownloadLaTeX}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải về .tex
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                <code>{latexCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Tài liệu Markdown giữ nguyên công thức toán MathJax/KaTeX, tiêu đề đề mục, bảng biểu và trích dẫn chuẩn hóa.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(markdownCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã sao chép' : 'Sao chép MD'}
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải về .md
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                <code>{markdownCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-6 py-4 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center border border-indigo-200">
                <Printer className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-base">In Ấn & Xuất Bản PDF Tiêu Chuẩn</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Hệ thống đã tinh chỉnh sẵn stylesheet in ấn (<code className="font-mono text-indigo-700">@media print</code>) chuẩn giấy A4, bảo toàn nguyên vẹn cấu trúc định dạng hai cột (Two-column layout), chân trang và công thức toán học.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-left text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800">Mẹo in ra file PDF đẹp nhất:</div>
                <div>• Chọn máy in là: <strong>Save as PDF (Lưu dưới dạng PDF)</strong></div>
                <div>• Bố cục: <strong>Dọc (Portrait)</strong>, Khổ giấy: <strong>A4</strong></div>
                <div>• Tùy chọn đồ họa: Tích chọn <strong>Background graphics (Đồ họa nền)</strong></div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Mở hộp thoại In / Lưu thành PDF
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-md text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
