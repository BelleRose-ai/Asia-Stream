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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-[#1e2029] hover:bg-violet-600 border border-[#2d2f39] text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-[#1e2029] hover:bg-violet-600 border border-[#2d2f39] text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-3 overflow-x-hidden py-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="w-36 sm:w-44 lg:w-48 h-52 sm:h-64 lg:h-72 flex-shrink-0 rounded-2xl bg-gray-900/80 border border-gray-800 animate-pulse"
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
            className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 snap-x scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => onSelectDrama(drama)}
                className="w-32 sm:w-42 lg:w-48 flex-shrink-0 group cursor-pointer snap-start transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="relative h-48 sm:h-60 lg:h-72 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#1a1b23] border border-[#2d2f39] shadow-lg">
                  {drama.posterUrl ? (
                    <img
                      src={drama.posterUrl}
                      alt={drama.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-violet-950/60 to-gray-900">
                      <Film className="w-10 h-10 text-violet-400 mb-2" />
                      <span className="text-xs font-bold text-white line-clamp-3">{drama.title}</span>
                      <span className="mt-2 px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {drama.category}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Rating & Category Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {drama.rating}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/90 text-white shadow">
                      {drama.category}
                    </span>
                  </div>

                  {/* Title & Year on Hover/Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <h4 
                      className="text-sm font-bold text-white drop-shadow leading-snug"
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
                    <p className="text-[11px] text-gray-300 flex items-center gap-2 mt-0.5">
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
