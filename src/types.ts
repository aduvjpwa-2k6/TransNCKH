export interface Author {
  name: string;
  affiliation?: string;
  email?: string;
}

export interface PaperMetadata {
  titleOriginal: string;
  titleVietnamese: string;
  authors: Author[];
  journalOrConference?: string;
  publishYear?: string;
  doi?: string;
  abstractOriginal: string;
  abstractVietnamese: string;
  keywordsOriginal: string[];
  keywordsVietnamese: string[];
}

export interface PaperSection {
  id: string;
  number?: string;
  titleOriginal: string;
  titleVietnamese: string;
  contentVietnamese: string;
  contentOriginal?: string;
}

export interface PaperTable {
  id: string;
  number: string;
  captionOriginal: string;
  captionVietnamese: string;
  headers: string[];
  rows: string[][];
  notes?: string;
}

export interface PaperFigure {
  id: string;
  number: string;
  captionOriginal: string;
  captionVietnamese: string;
  description?: string;
}

export interface PaperReference {
  id: string;
  rawText: string;
}

export interface GlossaryTerm {
  english: string;
  vietnamese: string;
  contextOrDefinition?: string;
}

export interface TranslatedPaper {
  id: string;
  metadata: PaperMetadata;
  sections: PaperSection[];
  tables?: PaperTable[];
  figures?: PaperFigure[];
  references: PaperReference[];
  glossary: GlossaryTerm[];
  translatedAt: string;
  stats: {
    originalWordCount: number;
    translatedWordCount: number;
    equationsCount: number;
    sectionsCount: number;
  };
}

export interface TranslationOptions {
  style: 'formal_ieee' | 'explanatory_bilingual' | 'compact';
  includeEnglishKeywordsInParens: boolean;
  paperLayout: 'two_column' | 'single_column' | 'bilingual_split';
}
