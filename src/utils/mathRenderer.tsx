import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  highlightGlossary?: { term: string; explanation?: string }[];
}

/**
 * Parses text containing inline $...$ and display $$...$$ LaTeX math formulas,
 * as well as bold/italic and citation markers [1], [2], rendering them cleanly.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-3.5 text-stone-800 text-[15px] leading-[1.65] font-serif ${className}`}>
      {paragraphs.map((paragraph, pIdx) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        // Check if paragraph is purely a display math equation: $$...$$
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
          const math = trimmed.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={pIdx}
                className="my-3 overflow-x-auto py-1 text-center font-sans text-stone-900"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return (
              <div key={pIdx} className="my-2 bg-stone-50 border border-stone-200 rounded p-2 text-center font-mono text-sm">
                {math}
              </div>
            );
          }
        }

        // Render inline elements including $...$, bold **...**, citations [1]
        const inlineElements = parseInlineContent(trimmed, pIdx);

        return (
          <p key={pIdx} className="text-justify indent-5 first-of-type:indent-0">
            {inlineElements}
          </p>
        );
      })}
    </div>
  );
};

function parseInlineContent(text: string, pIdx: number): React.ReactNode[] {
  // Regex to match $$display$$, $inline$, **bold**, *italic*, [number]
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*|\[\d+(?:[–\-,\s]*\d+)*\])/g;

  const parts = text.split(pattern);
  return parts.map((part, idx) => {
    if (!part) return null;

    // Display math inside paragraph
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(math, {
          displayMode: true,
          throwOnError: false,
        });
        return (
          <span
            key={`${pIdx}-${idx}`}
            className="block my-2 overflow-x-auto text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={`${pIdx}-${idx}`} className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">{math}</code>;
      }
    }

    // Inline math: $...$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            key={`${pIdx}-${idx}`}
            className="inline-block px-0.5 align-baseline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={`${pIdx}-${idx}`} className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">{math}</code>;
      }
    }

    // Bold text: **...**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${pIdx}-${idx}`} className="font-semibold text-stone-900 font-sans">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic text: *...*
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={`${pIdx}-${idx}`} className="italic text-stone-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Citation tag: [1], [2], [1-3]
    if (/^\[\d+(?:[–\-,\s]*\d+)*\]$/.test(part)) {
      return (
        <span
          key={`${pIdx}-${idx}`}
          className="text-indigo-800 font-medium font-sans text-xs px-1 hover:underline cursor-pointer align-super"
          title={`Trích dẫn tài liệu ${part}`}
        >
          {part}
        </span>
      );
    }

    return <span key={`${pIdx}-${idx}`}>{part}</span>;
  });
}
