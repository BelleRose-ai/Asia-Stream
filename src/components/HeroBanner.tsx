import React from 'react';
import { Play, Star, Calendar, ShieldCheck, Download } from 'lucide-react';
import { Drama } from '../types';

interface HeroBannerProps {
  drama: Drama;
  onSelectDrama: (drama: Drama) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ drama, onSelectDrama }) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#121212] border-b border-[#2d2f39]">
      {/* Backdrop Image with Gradients */}
      <div className="absolute inset-0">
        <img
          src={drama.backdropUrl}
          alt={drama.title}
          className="w-full h-full object-cover object-center opacity-75 scale-105 transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10]/90 via-[#0b0c10]/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 flex flex-col justify-end min-h-[460px] md:min-h-[520px]">
        <div className="max-w-2xl space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-violet-600/90 text-white backdrop-blur-md shadow-lg">
              {drama.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              {drama.rating} Rating
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-[#1a1b23]/80 text-gray-300 border border-[#2d2f39] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {drama.year}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {drama.episodesCount} Episodes ({drama.status})
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {drama.title}
          </h1>
          {drama.originalTitle && (
            <p className="text-sm font-medium text-gray-400 -mt-2">
              {drama.originalTitle} • {drama.country} ({drama.language})
            </p>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-1">
            {drama.genres.map((genre) => (
              <span key={genre} className="text-xs px-2.5 py-0.5 rounded-full bg-[#1a1b23] text-gray-300 border border-[#2d2f39]">
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed max-w-xl">
            {drama.synopsis}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onSelectDrama(drama)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download & Stream Episodes</span>
            </button>
            <button
              onClick={() => onSelectDrama(drama)}
              className="px-5 py-3 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-200 font-medium text-sm border border-[#2d2f39] flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
