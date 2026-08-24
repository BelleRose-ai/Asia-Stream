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
import { fetchAllGenreRows, searchTmdbLive, GenreSection } from './services/tmdb';
import { SearchX, Sparkles } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [showTelegramModal, setShowTelegramModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [genreRows, setGenreRows] = useState<GenreSection[]>([]);
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState<boolean>(true);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState<boolean>(false);

  // Fetch 5 distinct Genre rows on mount or category change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRows(true);
    fetchAllGenreRows(activeCategory)
      .then(rows => {
        if (isMounted) {
          setGenreRows(rows);
          setIsLoadingRows(false);
        }
      })
      .catch(err => {
        console.warn('Genre rows fetch error:', err);
        if (isMounted) setIsLoadingRows(false);
      });
    return () => { isMounted = false; };
  }, [activeCategory]);

  // Live TMDB search via server proxy
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    let isMounted = true;
    setIsSearchingTmdb(true);

    const timer = setTimeout(() => {
      searchTmdbLive(searchQuery)
        .then(results => {
          if (isMounted) {
            setSearchResults(results);
            setIsSearchingTmdb(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsSearchingTmdb(false);
        });
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Carousel featured dramas pulled from category rows confirmed by TMDB
  const carouselDramas = useMemo(() => {
    if (!genreRows || genreRows.length === 0) return [];
    const featured: Drama[] = [];
    const seenIds = new Set<string>();

    genreRows.forEach(section => {
      const best = section.dramas.find(d => d && d.backdropUrl && !seenIds.has(d.id));
      if (best) {
        seenIds.add(best.id);
        featured.push(best);
      }
    });

    return featured.slice(0, 5);
  }, [genreRows]);

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
        
        {/* Shimmering Skeleton Loader on Initial Load */}
        {isLoadingRows && !searchQuery && (
          <div className="space-y-12 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
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
                    {isSearchingTmdb ? 'Searching TMDB...' : `Showing ${searchResults.length} titles from TMDB`}
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
                  <h3 className="text-lg font-bold text-white">No Dramas Found</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    We couldn't find any matching titles for "{searchQuery}". Request it on our Telegram channel!
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
          /* Mandatory 5-Row Homepage Feed */
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

      {/* Footer strictly below all 5 rows */}
      <Footer
        onSelectCategory={cat => {
          setActiveCategory(cat);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTelegram={() => setShowTelegramModal(true)}
      />

      {/* Modals */}
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
