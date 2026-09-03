import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Film } from 'lucide-react';
import { Drama } from '../types';

interface GenreRowProps {
  title: string;
  subtitle: string;
  dramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  isLoading?: boolean;
}

export const GenreRow: React.FC<GenreRowProps> = ({
  title,
  subtitle,
  dramas,
  onSelectDrama,
  isLoading = false
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-3 group/row">
      <div className="flex items-end justify-between px-1">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => handleScroll('left')}
            className="w-9 h-9 rounded-full bg-[#1e2029] hover:bg-violet-600 border border-[#2d2f39] text-white flex items-center justify-center transition-all shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-9 h-9 rounded-full bg-[#1e2029] hover:bg-violet-600 border border-[#2d2f39] text-white flex items-center justify-center transition-all shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-4 overflow-x-hidden py-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="w-48 sm:w-56 h-72 sm:h-80 flex-shrink-0 rounded-2xl bg-gray-900/80 border border-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : dramas.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm bg-[#14151a] rounded-2xl border border-[#2d2f39]/50">
            No titles available for this section.
          </div>
        ) : (
          <div
            ref={rowRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-2 px-1 snap-x scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => onSelectDrama(drama)}
                className="w-36 sm:w-40 md:w-48 flex-shrink-0 group cursor-pointer snap-start transition-transform duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div className="relative h-52 sm:h-58 md:h-70 w-full rounded-2xl overflow-hidden bg-[#1a1b23] border border-[#2d2f39] shadow-lg flex flex-col justify-between p-2.5 sm:p-3">
                  {drama.posterUrl ? (
                    <img
                      src={drama.posterUrl}
                      alt={drama.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-violet-950/60 to-gray-900">
                      <Film className="w-10 h-10 text-violet-400 mb-2" />
                      <span className="text-xs font-bold text-white line-clamp-3">{drama.title}</span>
                      <span className="mt-2 px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {drama.category}
                      </span>
                    </div>
                  )}

                  {/* Heavy Gradient Overlay for flawless text legibility */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 40%, rgba(10,10,10,0) 100%)'
                    }}
                  />

                  {/* Rating & Category Badge */}
                  <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-xs font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-0.5 shadow">
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                      {drama.rating}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-semibold bg-violet-600/90 text-white shadow">
                      {drama.category}
                    </span>
                  </div>

                  {/* Title & Year at absolute bottom */}
                  <div className="relative z-10 pointer-events-none mt-auto">
                    <h4 
                      className="text-xs sm:text-sm font-bold text-white drop-shadow leading-snug"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                      }}
                    >
                      {drama.title}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] text-gray-300 flex items-center gap-2 mt-0.5">
                      <span>{drama.year}</span>
                      <span>•</span>
                      <span>{drama.episodesCount} Eps</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
