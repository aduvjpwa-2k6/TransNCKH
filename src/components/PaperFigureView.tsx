import React from 'react';
import { PaperFigure } from '../types';
import { LineChart, Cpu, Layers } from 'lucide-react';

interface PaperFigureViewProps {
  figure: PaperFigure;
}

export const PaperFigureView: React.FC<PaperFigureViewProps> = ({ figure }) => {
  return (
    <div className="my-6 paper-column-break-inside-avoid border border-stone-200/90 rounded bg-stone-50/40 p-4">
      {/* Diagrammatic Schematic Placeholder */}
      <div className="h-44 w-full bg-white border border-stone-200 rounded flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-md">
          <div className="flex items-center gap-3 text-stone-600">
            <div className="p-2 bg-stone-100 rounded-md border border-stone-200">
              <Cpu className="w-5 h-5 text-indigo-700" />
            </div>
            <span className="text-xs font-mono text-stone-400">⟶</span>
            <div className="p-2 bg-stone-100 rounded-md border border-stone-200">
              <Layers className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-xs font-mono text-stone-400">⟶</span>
            <div className="p-2 bg-stone-100 rounded-md border border-stone-200">
              <LineChart className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          <span className="font-mono text-xs text-stone-600 uppercase tracking-wider font-semibold">
            {figure.number}: Sơ đồ khối & Cơ chế thực nghiệm
          </span>
          {figure.description && (
            <p className="text-[11.5px] font-sans text-stone-500 max-w-sm">
              {figure.description}
            </p>
          )}
        </div>
      </div>

      {/* Caption Underneath (Scientific Standard) */}
      <div className="mt-3 text-center">
        <p className="font-sans text-xs text-stone-900 leading-snug">
          <strong className="font-bold">{figure.number}:</strong> {figure.captionVietnamese}
        </p>
        {figure.captionOriginal && (
          <p className="font-serif italic text-[11px] text-stone-500 mt-0.5">
            ({figure.captionOriginal})
          </p>
        )}
      </div>
    </div>
  );
};
