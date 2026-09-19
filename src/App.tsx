import React, { useState } from 'react';
import { TranslatedPaper, TranslationOptions } from './types';
import { SAMPLE_PAPERS, SamplePaper } from './data/samplePapers';
import { Navbar } from './components/Navbar';
import { EmptyState } from './components/EmptyState';
import { AcademicPaperView } from './components/AcademicPaperView';
import { UploadModal } from './components/UploadModal';
import { GlossaryModal } from './components/GlossaryModal';
import { ExportModal } from './components/ExportModal';
import { TranslationProgress } from './components/TranslationProgress';
import { AlertCircle, FileText, CheckCircle2, RotateCcw, Columns, Layout, ArrowLeftRight, BookOpen } from 'lucide-react';

export default function App() {
  const [paper, setPaper] = useState<TranslatedPaper | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'two_column' | 'single_column' | 'bilingual_split'>('two_column');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleTranslate = async (
    payload: { fileData?: string; fileType?: string; textContent?: string; fileName?: string },
    options: TranslationOptions
  ) => {
    setIsTranslating(true);
    setErrorMessage(null);
    if (payload.fileName) {
      setCurrentFileName(payload.fileName);
    }

    try {
      const response = await fetch('/api/translate-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: payload.fileData,
          fileType: payload.fileType,
          textContent: payload.textContent,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Yêu cầu dịch thất bại (${response.status})`);
      }

      const data: TranslatedPaper = await response.json();
      setPaper(data);
      setIsUploadOpen(false);
    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMessage(err.message || 'Không thể dịch bài báo khoa học. Vui lòng kiểm tra lại tệp và thử lại.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSelectSample = (sample: SamplePaper) => {
    handleTranslate(
      {
        textContent: sample.content,
        fileName: `${sample.title}.pdf`,
      },
      {
        style: 'formal_ieee',
        includeEnglishKeywordsInParens: true,
        paperLayout: 'two_column',
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onPrint={handlePrint}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        glossaryCount={paper?.glossary?.length || 0}
        hasPaper={!!paper}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-800 text-xs no-print">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong>Lỗi dịch thuật:</strong> {errorMessage}
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="underline text-rose-700 font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Loading State */}
        {isTranslating ? (
          <TranslationProgress fileName={currentFileName} />
        ) : paper ? (
          <div className="space-y-6">
            {/* Paper Overview Sub-bar (no-print) */}
            <div className="no-print bg-white border border-stone-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Đã dịch thành công sang Tiếng Việt chuẩn mực
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-mono mt-0.5">
                    <span>{paper.sections.length} mục đề</span>
                    <span>•</span>
                    <span>~{paper.stats.translatedWordCount.toLocaleString()} từ</span>
                    <span>•</span>
                    <span>{paper.glossary.length} thuật ngữ chuyên ngành</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile mode switch */}
                <div className="flex md:hidden items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
                  <button
                    onClick={() => setLayoutMode('two_column')}
                    className={`p-1.5 rounded ${layoutMode === 'two_column' ? 'bg-white shadow-xs' : ''}`}
                    title="Hai cột"
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('single_column')}
                    className={`p-1.5 rounded ${layoutMode === 'single_column' ? 'bg-white shadow-xs' : ''}`}
                    title="Một cột"
                  >
                    <Layout className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('bilingual_split')}
                    className={`p-1.5 rounded ${layoutMode === 'bilingual_split' ? 'bg-white shadow-xs' : ''}`}
                    title="Song ngữ"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-3 py-1.5 text-xs text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Dịch bài báo khác</span>
                </button>
              </div>
            </div>

            {/* Render Academic Paper */}
            <AcademicPaperView paper={paper} layoutMode={layoutMode} />
          </div>
        ) : (
          <EmptyState
            onOpenUpload={() => setIsUploadOpen(true)}
            onSelectSample={handleSelectSample}
            isTranslating={isTranslating}
          />
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onTranslate={handleTranslate}
        isTranslating={isTranslating}
      />

      {paper && (
        <>
          <GlossaryModal
            isOpen={isGlossaryOpen}
            onClose={() => setIsGlossaryOpen(false)}
            glossary={paper.glossary}
          />

          <ExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            paper={paper}
          />
        </>
      )}
    </div>
  );
}
