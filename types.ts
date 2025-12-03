export interface DistractorAnalysis {
  option: string;
  reason: string;
}

export interface QuestionAnalysis {
  id: number | string;
  type: string;
  correct_analysis: string;
  distractors: DistractorAnalysis[];
  // New fields for deep analysis
  design_principle: string; // 设题原理
  correct_opt_trait: string; // 正确选项特点
  wrong_opt_trait: string; // 错误选项特点
  trap_type: string; // 题目陷阱
}

export interface SentenceAnalysis {
  en: string;
  cn: string;
  grammar: string;
}

export interface VocabularyAnalysis {
  word: string;
  pos: string; // Part of speech
  meaning: string;
  cefr: string; // Difficulty level
  roots_affixes: string; // Etymology
  extensions: string; // Word family
  example: string; // Example sentence
  note?: string;
}

export interface StructureAnalysis {
  para: number;
  summary: string;
  logic_connectors: string[]; // Logic words found in this paragraph (e.g. "However (转折)")
}

export interface MetaAnalysis {
  cefr: string;
  topic: string;
  genre: string;
  logic_flow: string;
  word_count?: number;
  grade_suitability?: string;
}

export interface AnalysisResult {
  meta: MetaAnalysis;
  structure: StructureAnalysis[];
  questions?: QuestionAnalysis[];
  sentences: SentenceAnalysis[];
  vocabulary: VocabularyAnalysis[];
}

export interface GeminiError {
  message: string;
}