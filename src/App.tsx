import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DramaCard } from './components/DramaCard';
import { DramaModal } from './components/DramaModal';
import { TelegramModal } from './components/TelegramModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { DRAMA_DATABASE } from './data/dramas';
import { Drama, CategoryType } from './types';
import { fetchTmdbMetadata, searchTmdbLive, discoverTmdbCategory } from './services/tmdb';
import { Flame, Sparkles, SearchX, Key, Globe } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [showTelegramModal, setShowTelegramModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [tmdbApiKey, setTmdbApiKey] = useState<string>(() => localStorage.getItem('tmdb_api_key') || '');
  const [dramas, setDramas] = useState<Drama[]>(DRAMA_DATABASE);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState<boolean>(false);

  // Load live TMDB data when API key is configured or category changes
  useEffect(() => {
    let isMounted = true;
    if (!tmdbApiKey) {
      setDramas(DRAMA_DATABASE);
      return;
    }

    // Fetch discovered / trending items from TMDB for this category
    discoverTmdbCategory(activeCategory, tmdbApiKey)
      .then(results => {
        if (isMounted && results.length > 0) {
          // Merge with static database or use live results
          setDramas(results);
        }
      })
      .catch(err => console.warn('TMDB discover error:', err));

    return () => { isMounted = false; };
  }, [tmdbApiKey, activeCategory]);

  // Live TMDB search when query is typed and API key exists
  useEffect(() => {
    if (!tmdbApiKey || !searchQuery.trim()) return;

    let isMounted = true;
    setIsSearchingTmdb(true);

    const timer = setTimeout(() => {
      searchTmdbLive(searchQuery, tmdbApiKey)
        .then(results => {
          if (isMounted) {
            if (results.length > 0) {
              setDramas(results);
            }
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
  }, [searchQuery, tmdbApiKey]);

  const handleSaveApiKey = (key: string) => {
    setTmdbApiKey(key);
    localStorage.setItem('tmdb_api_key', key);
  };

  // Filtered dramas based on category and search query
  const filteredDramas = useMemo(() => {
    return dramas.filter(drama => {
      const matchesCategory =
        activeCategory === 'All'
          ? true
          : activeCategory === 'Trending'
          ? drama.isTrending
          : drama.category === activeCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        drama.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drama.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        drama.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drama.originalTitle && drama.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [dramas, activeCategory, searchQuery]);

  // Featured Hero drama
  const heroDrama = useMemo(() => {
    return dramas.find(d => d.isTrending) || dramas[0];
  }, [dramas]);

  const trendingDramas = useMemo(() => {
    return dramas.filter(d => d.isTrending);
  }, [dramas]);

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

      {/* TMDB API Key Prompt Banner if not set */}
      {!tmdbApiKey && (
        <div className="bg-gradient-to-r from-violet-900/40 via-cyan-900/40 to-violet-900/40 border-b border-violet-500/30 px-4 py-2.5 text-center text-xs sm:text-sm text-gray-200 flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-4 h-4 text-cyan-400" />
            Want to browse unlimited live movies & series directly from TMDB?
          </span>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow transition-all flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            <span>Enter TMDB API Key</span>
          </button>
        </div>
      )}

      {/* Hero Banner (Only shown on 'All' or 'Trending' when not searching) */}
      {heroDrama && !searchQuery && activeCategory === 'All' && (
        <HeroBanner drama={heroDrama} onSelectDrama={setSelectedDrama} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Trending Now Horizontal Carousel */}
        {!searchQuery && (activeCategory === 'All' || activeCategory === 'Trending') && trendingDramas.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Trending Now</h2>
                  <p className="text-xs text-gray-400">
                    {tmdbApiKey ? 'Live trending titles from TMDB' : 'Most popular Asian dramas and anime this week'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingDramas.map(drama => (
                <DramaCard key={drama.id} drama={drama} onSelectDrama={setSelectedDrama} />
              ))}
            </div>
          </section>
        )}

        {/* Main Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#2d2f39] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : activeCategory === 'All'
                    ? 'Latest Uploads & Complete Series'
                    : `${activeCategory} Collection`}
                </h2>
                <p className="text-xs text-gray-400">
                  {isSearchingTmdb ? 'Searching TMDB...' : `Showing ${filteredDramas.length} available titles with HD download links`}
                </p>
              </div>
            </div>
          </div>

          {filteredDramas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredDramas.map(drama => (
                <DramaCard key={drama.id} drama={drama} onSelectDrama={setSelectedDrama} />
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
                  {tmdbApiKey
                    ? `No live TMDB results for "${searchQuery}". Try another keyword or category!`
                    : `We couldn't find any matching titles for "${searchQuery}". Enter a TMDB API key in settings for live searches or request it on Telegram!`}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                {!tmdbApiKey && (
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs transition-all shadow"
                  >
                    Add TMDB API Key
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </section>

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
          currentApiKey={tmdbApiKey}
          onSaveApiKey={handleSaveApiKey}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
