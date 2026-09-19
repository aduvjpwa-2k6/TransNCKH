import React from 'react';
import { PaperMetadata } from '../types';
import { BookOpen, Calendar, ExternalLink } from 'lucide-react';

interface PaperHeaderViewProps {
  metadata: PaperMetadata;
  viewMode?: 'two_column' | 'single_column' | 'bilingual_split';
}

export const PaperHeaderView: React.FC<PaperHeaderViewProps> = ({ metadata }) => {
  return (
    <header className="border-b border-stone-200 pb-6 mb-8 text-center">
      {/* Journal / Conference publication metadata */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded text-xs text-stone-600 font-mono mb-4 border border-stone-200">
        <BookOpen className="w-3.5 h-3.5 text-stone-500" />
        <span>{metadata.journalOrConference || 'Kỷ yếu Hội nghị Khoa học Quốc tế (IEEE/ACM Proceedings)'}</span>
        {metadata.publishYear && (
          <>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              {metadata.publishYear}
            </span>
          </>
        )}
        {metadata.doi && (
          <>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1 text-indigo-700">
              DOI: {metadata.doi}
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </>
        )}
      </div>

      {/* Main Vietnamese Title */}
      <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-950 tracking-tight leading-tight max-w-4xl mx-auto mb-3">
        {metadata.titleVietnamese}
      </h1>

      {/* Original English Title */}
      <p className="text-stone-500 font-serif italic text-base sm:text-lg max-w-3xl mx-auto mb-6">
        {metadata.titleOriginal}
      </p>

      {/* Authors List with Affiliation Superscripts */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-stone-800 font-sans mb-4">
        {metadata.authors.map((author, index) => (
          <div key={index} className="inline-flex items-baseline">
            <span className="font-semibold text-stone-900">{author.name}</span>
            <sup className="text-xs text-indigo-700 font-bold ml-0.5">{index + 1}</sup>
            {index < metadata.authors.length - 1 && <span className="text-stone-300 ml-6 hidden sm:inline">•</span>}
          </div>
        ))}
      </div>

      {/* Affiliations & Emails */}
      <div className="text-xs text-stone-500 space-y-1 max-w-2xl mx-auto">
        {metadata.authors.map((author, index) => (
          <div key={index} className="flex justify-center items-center gap-2">
            <sup className="text-indigo-700 font-semibold">{index + 1}</sup>
            <span>{author.affiliation || 'Khoa Khoa học & Kỹ thuật Máy tính'}</span>
            {author.email && <span className="text-stone-400 font-mono">({author.email})</span>}
          </div>
        ))}
      </div>

      {/* Abstract and Keywords Box */}
      <div className="mt-8 mx-auto max-w-3xl bg-stone-50/80 border-y border-stone-300/80 py-5 px-6 text-left">
        <div className="text-[14.5px] leading-[1.65] font-serif text-stone-800">
          <span className="font-sans font-bold uppercase tracking-wider text-xs text-stone-900 mr-2">
            Tóm tắt (Abstract)—
          </span>
          <span className="italic">{metadata.abstractVietnamese}</span>
        </div>

        {/* Keywords */}
        {metadata.keywordsVietnamese && metadata.keywordsVietnamese.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-200/60 flex flex-wrap items-baseline gap-1.5 text-xs text-stone-700 font-sans">
            <span className="font-bold text-stone-900 mr-1">Từ khóa (Keywords):</span>
            {metadata.keywordsVietnamese.map((kw, i) => (
              <span
                key={i}
                className="bg-white border border-stone-200/90 px-2 py-0.5 rounded text-stone-800 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
