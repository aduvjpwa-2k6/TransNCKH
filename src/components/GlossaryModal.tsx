import React, { useState } from 'react';
import { GlossaryTerm } from '../types';
import { BookOpen, Search, X, Copy, Check } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossary: GlossaryTerm[];
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose, glossary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredGlossary = glossary.filter(
    item =>
      item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.contextOrDefinition && item.contextOrDefinition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (term: GlossaryTerm) => {
    navigator.clipboard.writeText(`${term.vietnamese} (${term.english})`);
    setCopiedKey(term.english);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">Bảng Chú Giải Thuật Ngữ Khoa Học</h2>
              <p className="text-xs text-stone-500">
                {glossary.length} thuật ngữ chuyên môn được chuẩn hóa trong bài báo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm thuật ngữ tiếng Anh hoặc tiếng Việt..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-6 space-y-3 flex-1">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              Không tìm thấy thuật ngữ phù hợp với "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 hover:bg-indigo-50/30 border border-stone-200 rounded-lg transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-indigo-900 font-sans">
                        {item.vietnamese}
                      </span>
                      <span className="text-xs font-mono text-stone-500 font-medium">
                        ({item.english})
                      </span>
                    </div>
                    {item.contextOrDefinition && (
                      <p className="text-xs text-stone-600 font-sans leading-relaxed">
                        {item.contextOrDefinition}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(item)}
                    className="shrink-0 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-white rounded border border-transparent hover:border-stone-200 transition-colors"
                    title="Sao chép thuật ngữ"
                  >
                    {copiedKey === item.english ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Chuẩn dịch thuật học thuật quốc tế</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
