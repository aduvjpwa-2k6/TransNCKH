import React, { useState } from 'react';
import { TranslatedPaper } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { PaperTableView } from './PaperTableView';
import { PaperFigureView } from './PaperFigureView';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';

interface BilingualSplitViewProps {
  paper: TranslatedPaper;
}

export const BilingualSplitView: React.FC<BilingualSplitViewProps> = ({ paper }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopySection = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">Chế độ Đối chiếu Song ngữ (Bilingual Alignment)</h3>
            <p className="text-xs text-stone-500">So sánh trực quan giữa văn bản gốc và bản dịch tiếng Việt học thuật theo từng đề mục.</p>
          </div>
        </div>
      </div>

      {/* Header Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        {/* English Header */}
        <div className="space-y-3 lg:border-r lg:border-stone-200 lg:pr-6">
          <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-700 font-mono text-xs rounded font-medium">
            English Original
          </span>
          <h2 className="text-xl font-bold font-serif text-stone-900">{paper.metadata.titleOriginal}</h2>
          <div className="text-xs text-stone-600 font-sans">
            <strong>Authors:</strong> {paper.metadata.authors.map(a => a.name).join(', ')}
          </div>
          {paper.metadata.abstractOriginal && (
            <div className="text-xs font-serif leading-relaxed text-stone-700 bg-stone-50 p-3.5 rounded border border-stone-200">
              <strong className="font-sans block mb-1">Abstract:</strong>
              {paper.metadata.abstractOriginal}
            </div>
          )}
        </div>

        {/* Vietnamese Header */}
        <div className="space-y-3">
          <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-mono text-xs rounded font-medium border border-indigo-100">
            Tiếng Việt (Học thuật)
          </span>
          <h2 className="text-xl font-bold font-serif text-stone-950">{paper.metadata.titleVietnamese}</h2>
          <div className="text-xs text-stone-600 font-sans">
            <strong>Tác giả:</strong> {paper.metadata.authors.map(a => a.name).join(', ')}
          </div>
          <div className="text-xs font-serif leading-relaxed text-stone-800 bg-indigo-50/40 p-3.5 rounded border border-indigo-100">
            <strong className="font-sans block mb-1 text-indigo-900">Tóm tắt (Abstract):</strong>
            {paper.metadata.abstractVietnamese}
          </div>
        </div>
      </div>

      {/* Section by Section Comparison */}
      <div className="space-y-6">
        {paper.sections.map((section, idx) => (
          <div
            key={section.id || idx}
            className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-stone-300 transition-colors"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-mono text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="font-semibold text-stone-900 text-sm">{section.titleVietnamese}</span>
              </div>
              <button
                onClick={() => handleCopySection(section.contentVietnamese, idx)}
                className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                title="Sao chép nội dung dịch"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Content */}
              <div className="lg:border-r lg:border-stone-200 lg:pr-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
                  {section.titleOriginal || 'Bản gốc'}
                </h4>
                {section.contentOriginal ? (
                  <div className="text-sm font-serif leading-relaxed text-stone-600 whitespace-pre-line">
                    {section.contentOriginal}
                  </div>
                ) : (
                  <div className="text-xs italic text-stone-400 font-sans py-4">
                    (Văn bản gốc tích hợp trong quá trình trích xuất PDF)
                  </div>
                )}
              </div>

              {/* Translated Content with KaTeX */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-700 mb-2">
                  {section.titleVietnamese}
                </h4>
                <MathRenderer content={section.contentVietnamese} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      {paper.tables && paper.tables.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-base font-sans text-stone-900 mb-4 pb-2 border-b border-stone-200">
            Bảng biểu đã chuyển đổi (Converted Tables)
          </h3>
          <div className="space-y-6">
            {paper.tables.map(tbl => (
              <PaperTableView key={tbl.id} table={tbl} />
            ))}
          </div>
        </div>
      )}

      {/* Figures Section */}
      {paper.figures && paper.figures.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-base font-sans text-stone-900 mb-4 pb-2 border-b border-stone-200">
            Hình vẽ & Chú giải (Figures & Captions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paper.figures.map(fig => (
              <PaperFigureView key={fig.id} figure={fig} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
