import React from 'react';
import { PaperTable } from '../types';
import { MathRenderer } from '../utils/mathRenderer';

interface PaperTableViewProps {
  table: PaperTable;
}

export const PaperTableView: React.FC<PaperTableViewProps> = ({ table }) => {
  return (
    <div className="my-6 paper-column-break-inside-avoid">
      {/* Caption */}
      <div className="text-center font-sans text-xs uppercase tracking-wider text-stone-900 font-bold mb-1.5">
        {table.number}: {table.captionVietnamese}
      </div>
      {table.captionOriginal && (
        <div className="text-center font-serif italic text-xs text-stone-500 mb-2">
          ({table.captionOriginal})
        </div>
      )}

      {/* Booktabs Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-serif text-[13.5px] leading-snug">
          <thead>
            {/* Top rule */}
            <tr className="border-t-2 border-b border-stone-900 bg-stone-50/50">
              {table.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="py-2 px-3 text-left font-sans font-semibold text-xs tracking-wider text-stone-900 uppercase"
                >
                  <MathRenderer content={header} className="!text-xs !font-sans !font-semibold !space-y-0" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`border-b border-stone-200/80 hover:bg-stone-50/60 transition-colors ${
                  rIdx % 2 === 1 ? 'bg-stone-50/30' : ''
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-2 px-3 align-top text-stone-800">
                    <MathRenderer content={cell} className="!text-[13px] !space-y-0" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Bottom rule */}
        <div className="border-b-2 border-stone-900 w-full" />
      </div>

      {/* Notes */}
      {table.notes && (
        <div className="mt-1.5 text-[11.5px] font-sans text-stone-500 italic text-left">
          * Ghi chú: {table.notes}
        </div>
      )}
    </div>
  );
};
