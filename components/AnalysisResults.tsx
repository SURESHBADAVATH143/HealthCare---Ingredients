import React from 'react';
import { AnalysisResult } from '../types';
import { Check, AlertTriangle, XCircle, HelpCircle, Heart, Beaker, Activity } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const isVegan = result.isVegan;
  const veganColor = isVegan 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' 
    : 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
  const veganIcon = isVegan ? <Check className="h-6 w-6" /> : <XCircle className="h-6 w-6" />;
  const veganIconBg = isVegan ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-rose-200 dark:bg-rose-800';

  // Function to determine health score color
  const getHealthColor = (score: number) => {
    if (score >= 8) return 'bg-green-600';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthBg = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    if (score >= 5) return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Summary Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Verdict</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.summary}</p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {/* Vegan Status */}
          <div className={`flex-1 p-4 rounded-xl border ${veganColor} flex items-start space-x-3 transition-colors duration-200`}>
            <div className={`mt-1 p-1 rounded-full ${veganIconBg} bg-opacity-80`}>
              {veganIcon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{isVegan ? 'Vegan Friendly' : 'Not Vegan'}</h3>
              <p className="text-sm opacity-90 mt-1">{result.veganReasoning}</p>
            </div>
          </div>

           {/* Health Score */}
           <div className={`flex-1 p-4 rounded-xl border flex items-start space-x-3 transition-colors duration-200 ${getHealthBg(result.healthRating)}`}>
            <div className="mt-1 p-1 rounded-full bg-white/50 dark:bg-black/20">
               <Activity className="h-6 w-6" />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">Health Score</h3>
                <span className="font-bold text-xl">{result.healthRating}/10</span>
              </div>
              <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${getHealthColor(result.healthRating)}`}
                  style={{ width: `${result.healthRating * 10}%` }}
                ></div>
              </div>
              <p className="text-xs mt-3 opacity-90 font-medium leading-relaxed">
                {result.healthRatingExplanation || "Score based on processing level and additives."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Allergens Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Allergen Watch</h3>
        </div>
        
        {result.detectedAllergens.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.detectedAllergens.map((allergen, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg font-semibold text-sm border border-amber-200 dark:border-amber-800/50">
                {allergen}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic flex items-center">
            <Check className="h-4 w-4 mr-2 text-emerald-500" /> No common allergens detected.
          </p>
        )}
      </div>

      {/* Technical Confusions / Glossary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="flex items-center space-x-2 mb-6">
          <Beaker className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Ingredient Decoder</h3>
        </div>

        {result.technicalTerms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {result.technicalTerms.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.term}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{item.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">No complex technical terms found to explain.</p>
        )}
      </div>

    </div>
  );
};