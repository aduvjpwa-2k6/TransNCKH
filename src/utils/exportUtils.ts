import { TranslatedPaper } from '../types';

export function generateLaTeX(paper: TranslatedPaper): string {
  const { metadata, sections, tables, references } = paper;

  let tex = `\\documentclass[journal,10pt,twocolumn]{IEEEtran}
\\usepackage[utf8]{inputenc}
\\usepackage[vietnamese,english]{babel}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{booktabs}
\\usepackage{cite}
\\usepackage{hyperref}

\\begin{document}

\\title{${escapeLaTeX(metadata.titleVietnamese)}\\\\
\\large\\textit{Bản dịch bài báo khoa học chuẩn mực: ${escapeLaTeX(metadata.titleOriginal)}}}

\\author{
${metadata.authors.map((a, i) => `\\IEEEauthorblockN{${escapeLaTeX(a.name)}}${a.affiliation ? `\\\\ \\IEEEauthorblockA{\\textit{${escapeLaTeX(a.affiliation)}}}${a.email ? `\\\\ \\textsf{${escapeLaTeX(a.email)}}` : ''}` : ''}`).join('\\and\n')}
}

\\maketitle

\\begin{abstract}
${escapeLaTeX(metadata.abstractVietnamese)}
\\end{abstract}

\\begin{IEEEkeywords}
${metadata.keywordsVietnamese.join(', ')}
\\end{IEEEkeywords}

`;

  // Sections
  for (const sec of sections) {
    tex += `\\section{${escapeLaTeX(sec.titleVietnamese)}}\n`;
    tex += `${convertMarkdownToLaTeX(sec.contentVietnamese)}\n\n`;
  }

  // Tables
  if (tables && tables.length > 0) {
    for (const tbl of tables) {
      tex += `\\begin{table}[htbp]
\\caption{${escapeLaTeX(tbl.captionVietnamese)}}
\\centering
\\begin{tabular}{${'l'.repeat(tbl.headers.length)}}
\\toprule
${tbl.headers.map(h => escapeLaTeX(h)).join(' & ')} \\\\
\\midrule
${tbl.rows.map(row => row.map(cell => escapeLaTeX(cell)).join(' & ')).join(' \\\\\n')} \\\\
\\bottomrule
\\end{tabular}
\\end{table}\n\n`;
    }
  }

  // References
  if (references && references.length > 0) {
    tex += `\\begin{thebibliography}{00}\n`;
    for (const ref of references) {
      const idMatch = ref.id.replace(/[\[\]]/g, '');
      tex += `\\bibitem{ref${idMatch}} ${escapeLaTeX(ref.rawText)}\n`;
    }
    tex += `\\end{thebibliography}\n`;
  }

  tex += `\\end{document}\n`;
  return tex;
}

export function generateMarkdown(paper: TranslatedPaper): string {
  const { metadata, sections, tables, figures, references, glossary } = paper;

  let md = `# ${metadata.titleVietnamese}\n`;
  md += `*Nguyên bản:* **${metadata.titleOriginal}**\n\n`;
  md += `**Tác giả:** ${metadata.authors.map(a => a.name + (a.affiliation ? ` (${a.affiliation})` : '')).join(', ')}\n\n`;
  
  if (metadata.journalOrConference) {
    md += `*Nguồn xuất bản:* ${metadata.journalOrConference} (${metadata.publishYear || ''})\n\n`;
  }

  md += `## Tóm tắt (Abstract)\n${metadata.abstractVietnamese}\n\n`;
  md += `**Từ khóa:** ${metadata.keywordsVietnamese.join(', ')}\n\n`;
  md += `---\n\n`;

  for (const sec of sections) {
    md += `## ${sec.number ? `${sec.number}. ` : ''}${sec.titleVietnamese}\n\n`;
    md += `${sec.contentVietnamese}\n\n`;
  }

  if (tables && tables.length > 0) {
    md += `## Bảng biểu\n\n`;
    for (const tbl of tables) {
      md += `### ${tbl.number}: ${tbl.captionVietnamese}\n\n`;
      md += `| ${tbl.headers.join(' | ')} |\n`;
      md += `| ${tbl.headers.map(() => '---').join(' | ')} |\n`;
      for (const row of tbl.rows) {
        md += `| ${row.join(' | ')} |\n`;
      }
      md += `\n`;
    }
  }

  if (figures && figures.length > 0) {
    md += `## Danh mục hình ảnh\n\n`;
    for (const fig of figures) {
      md += `- **${fig.number}:** ${fig.captionVietnamese}\n`;
    }
    md += `\n`;
  }

  if (references && references.length > 0) {
    md += `## Tài liệu tham khảo\n\n`;
    for (const ref of references) {
      md += `${ref.id} ${ref.rawText}\n\n`;
    }
  }

  if (glossary && glossary.length > 0) {
    md += `## Bảng thuật ngữ chuyên ngành\n\n`;
    md += `| Thuật ngữ tiếng Anh | Dịch tiếng Việt | Ghi chú & Định nghĩa |\n`;
    md += `| --- | --- | --- |\n`;
    for (const term of glossary) {
      md += `| ${term.english} | ${term.vietnamese} | ${term.contextOrDefinition || ''} |\n`;
    }
  }

  return md;
}

function escapeLaTeX(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function convertMarkdownToLaTeX(content: string): string {
  if (!content) return '';
  // Preserve raw LaTeX blocks: $$...$$ and $...$
  return content
    .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
    .replace(/\*(.*?)\*/g, '\\textit{$1}')
    .replace(/\[(\d+)\]/g, '\\cite{ref$1}');
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
