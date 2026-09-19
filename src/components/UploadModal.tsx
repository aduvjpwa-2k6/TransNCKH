import React, { useState, useRef } from 'react';
import { SAMPLE_PAPERS, SamplePaper } from '../data/samplePapers';
import { TranslationOptions } from '../types';
import { UploadCloud, FileText, Sparkles, Check, ArrowRight, X, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslate: (
    payload: { fileData?: string; fileType?: string; textContent?: string; fileName?: string },
    options: TranslationOptions
  ) => void;
  isTranslating: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onTranslate,
  isTranslating,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'samples' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [selectedSample, setSelectedSample] = useState<SamplePaper | null>(SAMPLE_PAPERS[0]);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Translation options
  const [style, setStyle] = useState<'formal_ieee' | 'explanatory_bilingual' | 'compact'>('formal_ieee');
  const [includeEnglishParens, setIncludeEnglishParens] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.txt', '.md', '.tex', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid && file.type !== 'application/pdf') {
      setErrorMessage('Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp PDF, TXT, MD, hoặc TeX.');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setErrorMessage('Kích thước tệp quá lớn (>40MB). Vui lòng tải lên tệp dưới 40MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const options: TranslationOptions = {
      style,
      includeEnglishKeywordsInParens: includeEnglishParens,
      paperLayout: 'two_column',
    };

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setErrorMessage('Vui lòng chọn hoặc kéo thả tệp bài báo khoa học.');
        return;
      }

      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        // Read as base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = (reader.result as string).split(',')[1];
          onTranslate(
            {
              fileData: base64Data,
              fileType: 'application/pdf',
              fileName: selectedFile.name,
            },
            options
          );
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc tệp PDF. Vui lòng thử lại.');
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Read text
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          onTranslate(
            {
              textContent: text,
              fileName: selectedFile.name,
            },
            options
          );
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc nội dung tệp. Vui lòng thử lại.');
        };
        reader.readAsText(selectedFile);
      }
    } else if (activeTab === 'samples') {
      if (!selectedSample) {
        setErrorMessage('Vui lòng chọn 1 bài báo mẫu.');
        return;
      }
      onTranslate(
        {
          textContent: selectedSample.content,
          fileName: `${selectedSample.title}.pdf`,
        },
        options
      );
    } else if (activeTab === 'paste') {
      if (!pastedText.trim() || pastedText.trim().length < 50) {
        setErrorMessage('Vui lòng dán nội dung bài báo khoa học (tối thiểu 50 ký tự).');
        return;
      }
      onTranslate(
        {
          textContent: pastedText,
          fileName: 'Van_ban_dan_truc_tiep.tex',
        },
        options
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div>
            <h2 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Tải Lên Bài Báo Khoa Học Cần Dịch
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Hệ thống bảo toàn 100% bố cục hai cột, công thức LaTeX, bảng dữ liệu và tài liệu tham khảo
            </p>
          </div>
          {!isTranslating && (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('upload')}
            disabled={isTranslating}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Tải lên tệp (PDF, Word, TXT, TeX)
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            disabled={isTranslating}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Bài báo kinh điển mẫu (1-Click Test)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            disabled={isTranslating}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Dán nội dung / LaTeX
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-stone-300 hover:border-indigo-400 hover:bg-stone-50/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.tex,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      selectedFile ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {selectedFile ? <Check className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
                  </div>

                  {selectedFile ? (
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-stone-500 mt-1 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Sẵn sàng chuyển dịch học thuật
                      </p>
                      <span className="inline-block mt-2 text-xs text-indigo-600 underline font-medium">
                        Bấm để đổi tệp khác
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">
                        Kéo & thả tệp bài báo vào đây, hoặc <span className="text-indigo-600 underline">chọn từ máy tính</span>
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Hỗ trợ PDF (định dạng khuyên dùng), TXT, LaTeX (.tex), Markdown (.md) lên tới 40MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sample Papers */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                Thử nghiệm ngay tính năng chuyển dịch với các bài báo khoa học nổi tiếng thế giới (giữ nguyên đầy đủ phương trình toán, bảng số liệu và danh mục trích dẫn):
              </p>
              <div className="grid grid-cols-1 gap-3">
                {SAMPLE_PAPERS.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => setSelectedSample(sample)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedSample?.id === sample.id
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded font-sans mb-1.5">
                          {sample.domain}
                        </span>
                        <h4 className="font-bold font-serif text-stone-900 text-sm">
                          {sample.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 font-sans">
                          {sample.description}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs font-mono text-stone-500 block">{sample.year}</span>
                        <div
                          className={`w-5 h-5 mt-2 rounded-full flex items-center justify-center text-white ${
                            selectedSample?.id === sample.id ? 'bg-indigo-600' : 'bg-stone-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Dán bản thảo bài báo khoa học hoặc mã nguồn LaTeX vào đây:
              </label>
              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Dán tiêu đề, tác giả, Abstract và các phần bài báo vào đây... Có thể bao gồm công thức $E=mc^2$ hoặc $$f(x)=\int...$$"
                rows={9}
                className="w-full p-3.5 text-xs font-mono border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Academic Translation Settings */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 font-sans">
              Tùy chọn phong cách dịch học thuật:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Style 1 */}
              <div
                onClick={() => setStyle('formal_ieee')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  style === 'formal_ieee'
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-xs text-stone-900">Chuẩn mực Tạp chí (IEEE/Nature)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Văn phong hàn lâm trang trọng, cô đọng, phù hợp công bố và báo cáo.
                </div>
              </div>

              {/* Style 2 */}
              <div
                onClick={() => setStyle('explanatory_bilingual')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  style === 'explanatory_bilingual'
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-xs text-stone-900">Hàn lâm Giải thích (Nghiên cứu)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Dịch chuẩn kèm giải thích ngữ cảnh các định lý và kỹ thuật cốt lõi.
                </div>
              </div>
            </div>

            {/* Checkbox: Include English keywords in parens */}
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeEnglishParens}
                onChange={e => setIncludeEnglishParens(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300"
              />
              <span className="text-xs text-stone-700">
                Kèm thuật ngữ gốc tiếng Anh trong ngoặc đơn ở lần xuất hiện đầu (Ví dụ: <em>Mạng nơ-ron tích chập (Convolutional Neural Network - CNN)</em>)
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {isTranslating ? (
              <span className="text-indigo-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                Đang dịch học thuật & bảo toàn định dạng...
              </span>
            ) : (
              <span>Thời gian xử lý: ~5-15 giây</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isTranslating && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium text-xs rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={isTranslating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isTranslating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý bài báo...</span>
                </>
              ) : (
                <>
                  <span>Bắt đầu dịch sang Tiếng Việt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
