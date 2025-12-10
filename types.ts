export interface TechnicalTerm {
  term: string;
  explanation: string;
  category: 'Preservative' | 'Colorant' | 'Flavor' | 'Emulsifier' | 'Other';
}

export interface AnalysisResult {
  isVegan: boolean;
  veganConfidence: 'High' | 'Medium' | 'Low';
  veganReasoning: string;
  detectedAllergens: string[];
  technicalTerms: TechnicalTerm[];
  summary: string;
  healthRating: number; // 1-10
  healthRatingExplanation?: string; // Explanation of the score
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  label: string;
  result: AnalysisResult;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  result: AnalysisResult | null;
  error: string | null;
}