import React from 'react';
import { Star, Download, Play } from 'lucide-react';
import { Drama } from '../types';

interface DramaCardProps {
  drama: Drama;
  onSelectDrama: (drama: Drama) => void;
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, onSelectDrama }) => {
  const handleClick = () => {
    onSelectDrama(drama);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#1a1b23] rounded-2xl overflow-hidden border border-[#2d2f39] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col h-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 flex items-center justify-center">
        {drama.posterUrl ? (
          <img
            src={drama.posterUrl}
            alt={drama.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1b23] to-gray-900 p-6 flex flex-col justify-between text-center border border-gray-800">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/50 py-1 px-2 rounded self-center">
              {drama.category}
            </span>
            <h4 className="text-sm font-extrabold text-white line-clamp-3">
              {drama.title}
            </h4>
            <span className="text-[10px] text-gray-400">
              {drama.year} • {drama.country}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b23] via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-md shadow-md">
            {drama.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#121212]/80 text-cyan-400 border border-[#2d2f39] backdrop-blur-md flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            {drama.rating}
          </span>
        </div>

        {/* Hover Quick Overlay Button */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Download className="w-5 h-5" />
          </div>
        </div>

        {/* Episode / Status Tag at bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-gray-300">
          <span className="bg-[#121212]/70 backdrop-blur-md px-2 py-0.5 rounded border border-[#2d2f39]">
            {drama.genres.includes('Movie') || drama.category === 'Movie' ? 'Feature Film' : (drama.episodesCount && drama.episodesCount > 0 ? `${drama.episodesCount} Eps` : 'Info unavailable')}
          </span>
          <span className="bg-[#121212]/70 backdrop-blur-md px-2 py-0.5 rounded border border-[#2d2f39]">
            {drama.year}
          </span>
        </div>
      </div>

      {/* Card Content Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 
            className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {drama.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
            {drama.genres.join(', ')}
          </p>
        </div>

        <div className="pt-2 border-t border-[#2d2f39]/50 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Play className="w-3 h-3 text-violet-400 fill-violet-400" />
            {drama.views || '1.5M'} views
          </span>
          <span className="text-cyan-400 font-semibold text-[11px] group-hover:underline">
            Download →
          </span>
        </div>
      </div>
    </div>
  );
};
