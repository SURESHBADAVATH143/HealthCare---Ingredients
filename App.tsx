import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryList } from './components/HistoryList';
import { AnalysisState, HistoryItem } from './types';
import { analyzeIngredients } from './services/geminiService';
import { useHistory } from './hooks/useHistory';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    result: null,
    error: null,
  });

  const { history, addToHistory, clearHistory } = useHistory();

  const handleAnalyze = async (text: string, image?: string, mimeType?: string, userAllergies?: string) => {
    setAnalysisState({ status: 'loading', result: null, error: null });

    try {
      const result = await analyzeIngredients(text, image, mimeType, userAllergies);
      setAnalysisState({ status: 'success', result, error: null });
      
      // Create a descriptive label for history
      let label = "Unknown Source";
      if (image) {
        label = "Image Scan";
      } else if (text) {
        // Truncate text for label
        label = text.length > 30 ? `"${text.substring(0, 30)}..."` : `"${text}"`;
      }
      
      addToHistory(result, label);

    } catch (err: any) {
      setAnalysisState({
        status: 'error',
        result: null,
        error: err.message || 'An unexpected error occurred',
      });
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setAnalysisState({
      status: 'success',
      result: item.result,
      error: null,
    });
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 transition-colors duration-200">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Intro Text - Only show if no result is displayed to reduce clutter */}
        {analysisState.status === 'idle' && (
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Know what you eat.</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Scan an ingredient label or paste the text to instantly check for allergens, 
              verify vegan status, and understand those complex chemical names.
            </p>
          </div>
        )}

        <InputSection 
          onAnalyze={handleAnalyze} 
          isLoading={analysisState.status === 'loading'} 
        />

        {analysisState.status === 'error' && (
          <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl flex items-start space-x-3 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-sm opacity-90">{analysisState.error}</p>
            </div>
          </div>
        )}

        {analysisState.status === 'success' && analysisState.result && (
          <AnalysisResults result={analysisState.result} />
        )}

        <HistoryList 
          history={history} 
          onSelect={handleSelectHistory} 
          onClear={clearHistory} 
        />

      </main>
      
      {/* Simple Footer */}
      <footer className="mt-16 py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} PureLabel. Powered by Google Gemini.</p>
        <p className="mt-1">Information is for reference only. Always verify with professionals.</p>
      </footer>
    </div>
  );
};

export default App;