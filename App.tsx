import React, { useState } from 'react';
import { analyzeText } from './services/geminiService';
import { AnalysisResult } from './types';
import { 
  MetaCard, 
  StructureCard, 
  SentenceCard, 
  VocabularyCard, 
  QuestionsCard 
} from './components/AnalysisComponents';

const App: React.FC = () => {
  const [passage, setPassage] = useState('');
  const [questions, setQuestions] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!passage.trim()) {
      setError("请先输入需要分析的英语文章。");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeText(passage, questions);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生意外错误，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPassage('');
    setQuestions('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">高考英语 <span className="text-indigo-400">深度精读助手</span></h1>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Input */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${result ? 'hidden lg:flex' : 'col-span-12 lg:col-span-12 max-w-3xl mx-auto'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="mb-4">
              <label htmlFor="passage" className="block text-sm font-bold text-slate-700 mb-2">
                阅读篇章 (Reading Passage) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="passage"
                className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-base leading-relaxed transition-all reading-text resize-none"
                placeholder="在此粘贴英语文章内容..."
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="questions" className="block text-sm font-bold text-slate-700 mb-2">
                题目 (Questions) <span className="font-normal text-slate-400">- 选填</span>
              </label>
              <textarea
                id="questions"
                className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm leading-relaxed transition-all font-mono resize-none"
                placeholder="在此粘贴题目文本 (如有)..."
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex-1 flex justify-center items-center py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all
                  ${loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在深度分析中...
                  </>
                ) : '开始深度解析'}
              </button>
              
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                清空
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                 <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className={`lg:col-span-7 flex flex-col ${!result && !loading ? 'hidden lg:flex items-center justify-center opacity-50' : ''}`}>
          
          {!result && !loading && (
             <div className="text-center p-12 border-2 border-dashed border-slate-300 rounded-xl">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <p className="text-slate-500 font-medium">深度解析报告将在此处显示。</p>
             </div>
          )}

          {loading && (
             <div className="space-y-6 animate-pulse">
                <div className="h-40 bg-slate-200 rounded-xl"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
                <div className="h-48 bg-slate-200 rounded-xl"></div>
             </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-2xl font-bold text-slate-800 font-serif">解析报告 (Report)</h2>
                 <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   复制 JSON
                 </button>
              </div>

              <MetaCard meta={result.meta} />
              <StructureCard structure={result.structure} />
              <SentenceCard sentences={result.sentences} />
              <VocabularyCard vocabulary={result.vocabulary} />
              {result.questions && result.questions.length > 0 && (
                <QuestionsCard questions={result.questions} />
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;