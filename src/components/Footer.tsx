import React from 'react';
import { Film, Send, ShieldCheck, Heart } from 'lucide-react';
import { CategoryType } from '../types';
import { AdBanner } from './AdBanner';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenTelegram: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenTelegram }) => {
  return (
    <footer className="bg-[#0b0c10] border-t border-[#2d2f39] text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Footer Ad Banners */}
        <div className="space-y-4 pb-6 border-b border-[#2d2f39]/60">
          <AdBanner type="728x90" desktopOnly={true} className="mb-4" />
          <AdBanner type="300x250" className="my-4" />
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-md">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AsiaStream Portal</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Your ultimate destination for streaming and downloading Asian entertainment, including hit K-Dramas, C-Dramas, and Anime series in 720p & 1080p HD.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenTelegram}
                className="px-4 py-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-cyan-300 hover:bg-[#0088cc]/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Join Official Telegram Channel</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('K-Drama')} className="hover:text-cyan-400 transition-colors">
                  Korean Dramas (K-Drama)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('C-Drama')} className="hover:text-cyan-400 transition-colors">
                  Chinese Dramas (C-Drama)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Anime')} className="hover:text-cyan-400 transition-colors">
                  Anime Series
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Trending')} className="hover:text-cyan-400 transition-colors">
                  🔥 Trending Now
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & DMCA</h4>
            <p className="text-[11px] leading-relaxed text-gray-400">
              This site does not host any files on its servers. All contents are provided by non-affiliated third parties. DMCA takedown requests should be directed to our Telegram channel support.
            </p>
          </div>
        </div>

        {/* TMDB Attribution & Logo Section */}
        <div className="p-5 bg-[#12131a] border border-[#2d2f39] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              className="w-28 h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs text-gray-400 text-center md:text-right max-w-lg leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#2d2f39]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AsiaStream Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Asian Drama Fans</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
