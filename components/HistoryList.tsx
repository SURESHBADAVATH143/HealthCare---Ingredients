import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, Camera, FileText } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
          Recent Scans
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear History
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex flex-col text-left p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start w-full mb-3">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                item.result.isVegan 
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
              }`}>
                {item.result.isVegan ? 'Vegan' : 'Not Vegan'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2 text-sm leading-snug">
               {item.result.summary}
            </p>
            
            <div className="mt-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {item.label.includes('Image') ? <Camera className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
              <span className="truncate max-w-[200px]">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};