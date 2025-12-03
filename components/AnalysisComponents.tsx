import React from 'react';
import { 
  MetaAnalysis, 
  StructureAnalysis, 
  SentenceAnalysis, 
  VocabularyAnalysis, 
  QuestionAnalysis 
} from '../types';

// --- Icons ---
const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const XIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const BulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);

// --- Cards ---

export const MetaCard: React.FC<{ meta: MetaAnalysis }> = ({ meta }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800">概览与难度分析 (Overview)</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CEFR 等级</span>
        <div className="text-lg font-bold text-indigo-600 mt-1">{meta.cefr} <span className="text-sm font-normal text-slate-600">({meta.grade_suitability})</span></div>
      </div>
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">文章体裁</span>
        <div className="text-lg font-bold text-slate-800 mt-1">{meta.genre}</div>
      </div>
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-1 md:col-span-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">话题类别</span>
        <div className="text-lg font-medium text-slate-800 mt-1">{meta.topic}</div>
      </div>
    </div>
    <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-indigo-900">
        <span className="font-bold mr-2">行文逻辑:</span> 
        {meta.logic_flow}
    </div>
  </div>
);

export const StructureCard: React.FC<{ structure: StructureAnalysis[] }> = ({ structure }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
      <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800">篇章结构与逻辑衔接 (Structure & Logic)</h2>
    </div>
    <div className="space-y-4">
      {structure.map((item, idx) => (
        <div key={idx} className="flex gap-4 group">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            {item.para}
          </div>
          <div className="p-4 bg-slate-50 rounded-lg flex-grow border border-slate-100 text-slate-700">
            <div className="mb-2 font-medium text-slate-900">{item.summary}</div>
            {item.logic_connectors && item.logic_connectors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">逻辑词:</span>
                {item.logic_connectors.map((logic, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-emerald-700 shadow-sm">
                    {logic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SentenceCard: React.FC<{ sentences: SentenceAnalysis[] }> = ({ sentences }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
     <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
      <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800">长难句深度解析 (Key Syntax - Top 5+)</h2>
    </div>
    <div className="space-y-6">
      {sentences.map((sent, idx) => (
        <div key={idx} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          <div className="p-4 bg-white border-b border-slate-100 reading-text text-lg text-slate-800 italic">
            "{sent.en}"
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-3 text-slate-700">
              <span className="font-bold text-xs uppercase bg-slate-200 px-2 py-1 rounded text-slate-600 h-fit whitespace-nowrap">译文</span>
              <span>{sent.cn}</span>
            </div>
            <div className="flex gap-3 text-slate-700">
              <span className="font-bold text-xs uppercase bg-amber-100 px-2 py-1 rounded text-amber-700 h-fit whitespace-nowrap">句法</span>
              <span className="text-sm leading-relaxed">{sent.grammar}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const VocabularyCard: React.FC<{ vocabulary: VocabularyAnalysis[] }> = ({ vocabulary }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
     <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
      <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
        <BookIcon />
      </div>
      <h2 className="text-xl font-bold text-slate-800">进阶核心词汇 (Advanced Vocabulary &gt; B2)</h2>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {vocabulary.map((vocab, idx) => (
        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-lg group hover:border-rose-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl text-slate-900">{vocab.word}</span>
              <span className="text-sm font-serif italic text-slate-500">{vocab.pos}</span>
            </div>
            <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">{vocab.cefr}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="col-span-1 md:col-span-2 text-base font-medium text-slate-800 mb-1">
              {vocab.meaning}
            </div>
            
            <div className="flex gap-2">
              <span className="text-slate-400 font-semibold min-w-[3rem]">词根:</span>
              <span className="text-slate-700">{vocab.roots_affixes || '-'}</span>
            </div>
            
            <div className="flex gap-2">
              <span className="text-slate-400 font-semibold min-w-[3rem]">拓展:</span>
              <span className="text-slate-700 italic">{vocab.extensions || '-'}</span>
            </div>
            
            <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-slate-200 flex gap-2">
              <span className="text-rose-500 font-bold min-w-[3rem]">例句:</span>
              <span className="text-slate-600 italic">"{vocab.example}"</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const QuestionsCard: React.FC<{ questions: QuestionAnalysis[] }> = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">题目设题原理深度解析 (Question Analysis)</h2>
      </div>
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-700">Question {q.id}</span>
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-1 rounded-full">{q.type}</span>
            </div>
            
            <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Basic Analysis */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0"><CheckIcon /></div>
                  <div>
                    <h4 className="font-bold text-emerald-700 text-sm mb-1">正确选项解析</h4>
                    <p className="text-slate-700 text-sm">{q.correct_analysis}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-500 text-xs uppercase mb-2">干扰项解析</h4>
                  <div className="space-y-2">
                    {q.distractors.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0"><XIcon /></div>
                        <div className="text-sm">
                          <span className="font-bold text-slate-800 mr-2">{d.option}</span>
                          <span className="text-slate-600">{d.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Deep Dive (Meta) */}
              <div className="bg-violet-50 rounded-lg p-4 text-sm space-y-3 border border-violet-100">
                <div className="flex items-center gap-2 text-violet-800 font-bold border-b border-violet-200 pb-2 mb-2">
                  <BulbIcon /> 命题解密 (Examiner's Mindset)
                </div>
                
                <div>
                  <span className="font-semibold text-violet-700 block text-xs uppercase">设题原理</span>
                  <span className="text-slate-800">{q.design_principle}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                     <span className="font-semibold text-emerald-700 block text-xs uppercase">正确选项特点</span>
                     <span className="text-slate-700 text-xs">{q.correct_opt_trait}</span>
                  </div>
                   <div>
                     <span className="font-semibold text-red-600 block text-xs uppercase">错误选项特点</span>
                     <span className="text-slate-700 text-xs">{q.wrong_opt_trait}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-violet-200 mt-1">
                   <span className="font-semibold text-orange-600 block text-xs uppercase">题目陷阱 (Trap)</span>
                   <span className="text-slate-800 font-medium">{q.trap_type}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};