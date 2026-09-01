import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GenreRow } from './components/GenreRow';
import { DramaCard } from './components/DramaCard';
import { DramaModal } from './components/DramaModal';
import { TelegramModal } from './components/TelegramModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { Drama, CategoryType } from './types';
import { fetchAllCuratedGenreRows, GenreSection } from './services/tmdb';
import { DRAMA_DATABASE } from './data/dramas';
import { SearchX, Sparkles } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [showTelegramModal, setShowTelegramModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [genreRows, setGenreRows] = useState<GenreSection[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState<boolean>(true);

  // Fetch curated rows strictly from local store & TMDB metadata loader
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRows(true);
    fetchAllCuratedGenreRows(activeCategory)
      .then(rows => {
        if (isMounted) {
          setGenreRows(rows);
          setIsLoadingRows(false);
        }
      })
      .catch(err => {
        console.warn('Curated genre rows error:', err);
        if (isMounted) setIsLoadingRows(false);
      });
    return () => { isMounted = false; };
  }, [activeCategory]);

  // Local filtered search across curated database (Nkiri-style curated blog catalog)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DRAMA_DATABASE.filter(d => 
      d.title.toLowerCase().includes(q) || 
      (d.originalTitle && d.originalTitle.toLowerCase().includes(q)) ||
      d.genres.some(g => g.toLowerCase().includes(q)) ||
      d.country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Carousel featured dramas: randomly rotating up to 2 movies/series from each category (Anime, C-Drama, K-Drama)
  const carouselDramas = useMemo(() => {
    const categories: CategoryType[] = ['Anime', 'C-Drama', 'K-Drama'];
    let selected: Drama[] = [];

    categories.forEach(cat => {
      const items = DRAMA_DATABASE.filter(d => d.category === cat && d.backdropUrl);
      const sorted = [...items].reverse(); // newest first
      selected.push(...sorted.slice(0, 2));
    });

    if (selected.length === 0) {
      selected = DRAMA_DATABASE.filter(d => d.backdropUrl).slice(0, 6);
    }

    return selected.sort(() => Math.random() - 0.5);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTelegram={() => setShowTelegramModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Hero Banner Carousel */}
      {carouselDramas.length > 0 && !searchQuery && activeCategory === 'All' && (
        <HeroBanner dramas={carouselDramas} onSelectDrama={setSelectedDrama} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Shimmering Skeleton Loader */}
        {isLoadingRows && !searchQuery && (
          <div className="space-y-12 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-56 bg-gray-800/80 rounded-md" />
                <div className="flex gap-4 overflow-x-hidden">
                  {[1, 2, 3, 4, 5].map(j => (
                    <div key={j} className="w-[200px] h-80 bg-gray-900/80 rounded-2xl border border-gray-800/60 flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results Grid */}
        {searchQuery ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#2d2f39] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Search Results for "{searchQuery}"
                  </h2>
                  <p className="text-xs text-gray-400">
                    Showing {searchResults.length} verified titles from curated archive
                  </p>
                </div>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {searchResults.map(drama => (
                  <div key={drama.id} className="w-full">
                    <DramaCard drama={drama} onSelectDrama={setSelectedDrama} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 bg-[#1a1b23]/40 border border-[#2d2f39] rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                  <SearchX className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Titles Found</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    We couldn't find any matching titles for "{searchQuery}". Request it in the comments or on our Telegram channel!
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        ) : (
          /* Curated Homepage Feed */
          !isLoadingRows && genreRows.length > 0 && (
            <div className="space-y-12">
              {genreRows.map((row, idx) => (
                <GenreRow
                  key={idx}
                  title={row.title}
                  subtitle={row.subtitle}
                  dramas={row.dramas}
                  onSelectDrama={setSelectedDrama}
                />
              ))}
            </div>
          )
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={cat => {
          setActiveCategory(cat);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTelegram={() => setShowTelegramModal(true)}
      />

      {/* Details & Download Modal */}
      {selectedDrama && (
        <DramaModal
          drama={selectedDrama}
          onClose={() => setSelectedDrama(null)}
          onOpenTelegram={() => setShowTelegramModal(true)}
        />
      )}

      {showTelegramModal && (
        <TelegramModal onClose={() => setShowTelegramModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
