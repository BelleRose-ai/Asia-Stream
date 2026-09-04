import React, { useState } from 'react';
import { Search, Send, Film, Flame, X } from 'lucide-react';
import { CategoryType } from '../types';

interface NavbarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTelegram: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenTelegram
}) => {
  const categories: CategoryType[] = ['All', 'K-Drama', 'K-Movies', 'C-Drama', 'J-Drama', 'PH-Drama', 'Anime', 'Anime-Movies', 'Trending'];
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/90 backdrop-blur-md border-b border-[#2d2f39] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('All')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Asia<span className="text-cyan-400">Stream</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-violet-400 font-semibold -mt-1">
              Asian Drama Portal
            </span>
          </div>
        </div>

        {/* Categories (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1a1b23] p-1.5 rounded-full border border-[#2d2f39]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="hidden sm:block relative w-48 md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dramas, anime..."
              className="w-full pl-9 pr-4 py-2 bg-[#1a1b23] border border-[#2d2f39] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Mobile Search Icon Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-[#1a1b23] border border-[#2d2f39] text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            aria-label="Toggle Search"
          >
            {mobileSearchOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Search className="w-5 h-5 text-gray-300" />}
          </button>

          {/* Telegram Channel Button */}
          <button
            onClick={onOpenTelegram}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-cyan-300 hover:bg-[#0088cc]/30 transition-all text-xs font-semibold shadow-sm animate-pulse min-h-[44px]"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Join Telegram</span>
          </button>
        </div>
      </div>

      {/* Expanded Mobile Search Input Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 py-3 bg-[#121212] border-t border-[#2d2f39] animate-fade-in">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dramas, anime..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#1a1b23] border border-cyan-500/60 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-md"
            />
          </div>
        </div>
      )}

      {/* Mobile Categories Row with Scroll Affordance Mask */}
      <div 
        className="flex md:hidden overflow-x-auto px-4 py-2.5 bg-[#121212] border-t border-[#2d2f39] gap-2 scrollbar-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 min-h-[36px] ${
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
