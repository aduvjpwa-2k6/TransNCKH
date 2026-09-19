import React from 'react';
import { TranslatedPaper } from '../types';
import { PaperHeaderView } from './PaperHeaderView';
import { MathRenderer } from '../utils/mathRenderer';
import { PaperTableView } from './PaperTableView';
import { PaperFigureView } from './PaperFigureView';
import { BilingualSplitView } from './BilingualSplitView';
import { Bookmark, Hash, Layers } from 'lucide-react';

interface AcademicPaperViewProps {
  paper: TranslatedPaper;
  layoutMode: 'two_column' | 'single_column' | 'bilingual_split';
}

export const AcademicPaperView: React.FC<AcademicPaperViewProps> = ({
  paper,
  layoutMode,
}) => {
  if (layoutMode === 'bilingual_split') {
    return <BilingualSplitView paper={paper} />;
  }

  // Convert section index to Roman numeral if no custom number provided
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  return (
    <div className="academic-paper bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-12 max-w-5xl mx-auto shadow-sm">
      {/* Top Academic Running Header (Journal Header) */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-2 mb-8 text-[11px] font-sans font-medium text-stone-500 uppercase tracking-widest">
        <span>Kỷ yếu Bài Báo Khoa Học Quốc Tế • Bản Dịch Học Thuật Tiếng Việt</span>
        <span className="font-mono">{new Date(paper.translatedAt).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Main Paper Header (Title, Authors, Affiliations, Abstract, Keywords) */}
      <PaperHeaderView metadata={paper.metadata} />

      {/* Two-Column vs Single-Column Layout */}
      <div
        className={
          layoutMode === 'two_column'
            ? 'md:columns-2 md:gap-8 [column-fill:balance] space-y-6 text-justify'
            : 'max-w-3xl mx-auto space-y-6 text-justify'
        }
      >
        {/* Render Sections */}
        {paper.sections.map((section, idx) => {
          const sectionNum = section.number || romanNumerals[idx] || `${idx + 1}`;

          return (
            <section
              key={section.id || idx}
              className="paper-column-break-inside-avoid mb-6"
            >
              {/* Section Header with Roman or Arabic Numeral */}
              <h2 className="text-sm sm:text-[15px] font-bold font-sans text-stone-950 uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-200 flex items-baseline gap-2">
                <span className="text-indigo-700 font-mono text-xs">{sectionNum}.</span>
                <span>{section.titleVietnamese}</span>
              </h2>

              {/* Section Content with Math and Citations */}
              <MathRenderer content={section.contentVietnamese} />
            </section>
          );
        })}

        {/* Embedded Tables */}
        {paper.tables && paper.tables.length > 0 && (
          <div className="paper-column-break-inside-avoid">
            {paper.tables.map(tbl => (
              <PaperTableView key={tbl.id} table={tbl} />
            ))}
          </div>
        )}

        {/* Embedded Figures */}
        {paper.figures && paper.figures.length > 0 && (
          <div className="paper-column-break-inside-avoid">
            {paper.figures.map(fig => (
              <PaperFigureView key={fig.id} figure={fig} />
            ))}
          </div>
        )}

        {/* References Section */}
        {paper.references && paper.references.length > 0 && (
          <section className="paper-column-break-inside-avoid mt-8 pt-4 border-t border-stone-200">
            <h2 className="text-sm font-bold font-sans text-stone-950 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-indigo-700" />
              <span>Tài Liệu Tham Khảo (References)</span>
            </h2>
            <div className="space-y-2 text-[12.5px] font-serif leading-relaxed text-stone-700">
              {paper.references.map((ref, rIdx) => (
                <div key={ref.id || rIdx} className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-indigo-800 shrink-0 select-none">
                    {ref.id || `[${rIdx + 1}]`}
                  </span>
                  <span className="text-stone-800">{ref.rawText}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Academic Running Footer */}
      <div className="mt-12 pt-4 border-t border-stone-300 flex items-center justify-between text-[11px] font-mono text-stone-400">
        <span>Bản quyền dịch thuật khoa học • Định dạng IEEE / Springer Style</span>
        <span>Trang 1 / 1</span>
      </div>
    </div>
  );
};
