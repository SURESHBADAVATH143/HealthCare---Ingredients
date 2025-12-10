import { useState, useEffect } from 'react';
import { AnalysisResult, HistoryItem } from '../types';

const MAX_HISTORY = 10;
const STORAGE_KEY = 'purelabel_history';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
        // If parse fails, clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToHistory = (result: AnalysisResult, inputLabel: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      label: inputLabel,
      result,
    };

    setHistory((prev) => {
      // Filter out duplicates based on result summary or strict equality if desired, 
      // but for now just simple prepend.
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, clearHistory };
};