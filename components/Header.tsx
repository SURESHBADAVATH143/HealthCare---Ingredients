import React from 'react';
import { Leaf, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-emerald-600 dark:bg-emerald-900/90 text-white shadow-lg sticky top-0 z-50 transition-colors duration-200 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6" />
          <h1 className="text-xl font-bold tracking-tight">PureLabel</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium opacity-90">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <span className="hidden sm:inline">Decode Ingredients</span>
          <Info className="h-5 w-5 sm:hidden" />
        </div>
      </div>
    </header>
  );
};