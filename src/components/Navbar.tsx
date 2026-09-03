import React from 'react';
import { Search, Send, Film, Settings, Flame } from 'lucide-react';
import { CategoryType } from '../types';

interface NavbarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTelegram: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenTelegram,
  onOpenSettings
}) => {
  const categories: CategoryType[] = ['All', 'K-Drama', 'K-Movies', 'C-Drama', 'J-Drama', 'PH-Drama', 'Anime', 'Trending'];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#2d2f39] transition-all w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0" onClick={() => onSelectCategory('All')}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <span className="text-sm sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Asia<span className="text-cyan-400">Stream</span>
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-violet-400 font-semibold block -mt-0.5 sm:-mt-1">
              Drama Portal
            </span>
          </div>
        </div>

        {/* Categories (Desktop & Tablet) */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#1a1b23] p-1.5 rounded-full border border-[#2d2f39]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-[#2d2f39]/50'
                }`}
              >
                {cat === 'Trending' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="relative w-28 sm:w-44 md:w-60">
            <span className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 sm:pl-9 pr-2 sm:pr-4 py-1.5 sm:py-2 bg-[#1a1b23] border border-[#2d2f39] rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Telegram Channel Button */}
          <button
            onClick={onOpenTelegram}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-cyan-300 hover:bg-[#0088cc]/30 transition-all text-[11px] sm:text-xs font-semibold shadow-sm flex-shrink-0"
            title="Join Telegram"
          >
            <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Telegram</span>
          </button>

          {/* Settings / TMDB Key */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2.5 rounded-xl bg-[#1a1b23] border border-[#2d2f39] text-gray-400 hover:text-white hover:bg-[#2d2f39] transition-all flex-shrink-0"
            title="TMDB API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile & Secondary Categories Row */}
      <div className="flex xl:hidden overflow-x-auto px-3 py-2 bg-[#121212] border-t border-[#2d2f39] gap-1.5 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'bg-[#1a1b23] text-gray-300 border border-[#2d2f39]'
              }`}
            >
              {cat === 'Trending' && <Flame className="w-3 h-3 text-amber-400" />}
              {cat}
            </button>
          );
        })}
      </div>
    </header>
  );
};
