import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Film, Download, Clock, AlertCircle, Layers, Play, ExternalLink, Sparkles } from 'lucide-react';
import { Drama, Episode } from '../types';
import { fetchTmdbMetadata, fetchSeasonEpisodes } from '../services/tmdb';
import { getEmbedMovieUrl, getEmbedTvUrl, EmbedProvider, PROVIDER_LABELS } from '../services/embed';

interface DramaModalProps {
  drama: Drama;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const DramaModal: React.FC<DramaModalProps> = ({ drama, onClose, onOpenTelegram }) => {
  const [currentDrama, setCurrentDrama] = useState<Drama>(drama);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisodeNum, setSelectedEpisodeNum] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>(drama.episodes || []);
  const [isLoadingSeason, setIsLoadingSeason] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('720p / 1080p');
  const [selectedProvider, setSelectedProvider] = useState<EmbedProvider>('vidsrc.to');
  const [downloadingEp, setDownloadingEp] = useState<number | null>(null);

  const isMovie = currentDrama.genres.includes('Movie') || currentDrama.episodesCount === 1 || (currentDrama.genres && currentDrama.genres.includes('Blockbuster'));

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (drama.tmdbId) {
      setIsLoadingDetails(true);
      fetchTmdbMetadata(drama)
        .then(updated => {
          if (isMounted) {
            setCurrentDrama(updated);
            if (updated.seasons && updated.seasons.length > 0) {
              const firstSeasonNum = updated.seasons[0].seasonNumber;
              setSelectedSeason(firstSeasonNum);
              if (updated.episodes && updated.episodes.length > 0) {
                setSeasonEpisodes(updated.episodes);
              }
            } else if (updated.episodes && updated.episodes.length > 0) {
              setSeasonEpisodes(updated.episodes);
            }
            setIsLoadingDetails(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingDetails(false);
        });
    }
    return () => { isMounted = false; };
  }, [drama]);

  const handleSeasonChange = async (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisodeNum(1);
    if (!currentDrama.tmdbId || isMovie) return;

    setIsLoadingSeason(true);
    const eps = await fetchSeasonEpisodes(currentDrama.tmdbId, seasonNum);
    if (eps.length > 0) {
      setSeasonEpisodes(eps);
    } else {
      const count = currentDrama.seasons?.find(s => s.seasonNumber === seasonNum)?.episodeCount || 16;
      setSeasonEpisodes(Array.from({ length: count }, (_, i) => ({
        epNum: i + 1,
        quality: '1080p FHD',
        downloadUrl: `https://streamwish.to/tmdb-${currentDrama.tmdbId}-s${seasonNum}e${i + 1}`,
        title: `Episode ${i + 1}`,
        duration: '45m'
      })));
    }
    setIsLoadingSeason(false);
  };

  const handleDownloadClick = (ep: Episode) => {
    if (!ep.downloadUrl) {
      onOpenTelegram();
      return;
    }

    setDownloadingEp(ep.epNum);
    setTimeout(() => {
      window.open(ep.downloadUrl, '_blank', 'noopener,noreferrer');
      setDownloadingEp(null);
    }, 600);
  };

  const embedUrl = isMovie && currentDrama.tmdbId
    ? getEmbedMovieUrl(currentDrama.tmdbId, selectedProvider)
    : currentDrama.tmdbId
    ? getEmbedTvUrl(currentDrama.tmdbId, selectedSeason, selectedEpisodeNum, selectedProvider)
    : '';

  const activeEpisode = seasonEpisodes.find(ep => ep.epNum === selectedEpisodeNum);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] overflow-y-auto animate-fade-in">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-[#2d2f39] px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-white border border-[#2d2f39] flex items-center gap-2 text-sm font-semibold transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Browse</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600 text-white shadow">
            {currentDrama.category}
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            {currentDrama.title}
          </span>
        </div>
      </header>

      {/* Hero Backdrop Banner Header */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gray-900 flex-shrink-0 border-b border-[#2d2f39]">
        <img
          src={currentDrama.backdropUrl}
          alt={currentDrama.title}
          className="w-full h-full object-cover object-center opacity-45 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/50 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                {currentDrama.rating} Rating
              </span>
              <span className="px-3 py-1 rounded-md text-xs text-gray-300 bg-[#1a1b23]/80 border border-[#2d2f39]">
                {currentDrama.year}
              </span>
              <span className="px-3 py-1 rounded-md text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                {currentDrama.status}
              </span>
              {isLoadingDetails && (
                <span className="px-3 py-1 rounded-md text-xs text-amber-300 bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Fetching Live Metadata...
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {currentDrama.title}
            </h1>
            {currentDrama.originalTitle && (
              <p className="text-xs sm:text-sm font-medium text-gray-400">
                {currentDrama.originalTitle} • {currentDrama.country} ({currentDrama.language})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Container / Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* PLAYER SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#121212] p-4 rounded-2xl border border-[#2d2f39]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                <Play className="w-4 h-4 fill-violet-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Immersive Stream Player</span>
                  {!isMovie && (
                    <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      S{selectedSeason} E{selectedEpisodeNum}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400">Select server below or open in full-screen tab to bypass sandbox restrictions.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {/* Sandbox Bypass / Full Screen External Player Button */}
              {embedUrl && (
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>🚀 Open Stream in New Tab (Full Screen)</span>
                </a>
              )}

              {/* Server Switcher */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium">Server:</span>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as EmbedProvider)}
                  aria-label="Select Video Stream Server"
                  className="bg-[#1a1b23] border border-[#2d2f39] text-cyan-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-bold shadow-inner"
                >
                  {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 16:9 Video Player Container */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#2d2f39] shadow-2xl relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-top-navigation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentDrama.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Initializing video player...
              </div>
            )}
          </div>

          {/* ACTION CONTROL PANEL: Hybrid Download & Server Routing */}
          <div className="p-5 rounded-2xl bg-[#1a1b23] border border-[#2d2f39] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{isMovie ? '🎬 Movie Stream & Download Options' : `📺 S${selectedSeason} E${selectedEpisodeNum} Download Servers`}</span>
              </span>
              <p className="text-xs text-gray-400">
                Access multi-source backup servers or download direct in high definition.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all w-full md:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>⬇️ Open Player Download Servers</span>
              </a>

              {activeEpisode && activeEpisode.downloadUrl ? (
                <button
                  onClick={() => handleDownloadClick(activeEpisode)}
                  disabled={downloadingEp === activeEpisode.epNum}
                  className="px-5 py-3 rounded-xl bg-[#252836] hover:bg-[#2d2f39] text-gray-200 border border-[#2d2f39] font-medium text-xs flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>⬇️ Download Direct (HD)</span>
                </button>
              ) : (
                <button
                  onClick={onOpenTelegram}
                  className="px-5 py-3 rounded-xl bg-[#252836] hover:bg-[#2d2f39] text-gray-400 text-xs border border-[#2d2f39] flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                >
                  ⚡ Request Download via Telegram
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SYNOPSIS & GENRES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              {currentDrama.genres.map((g) => (
                <span key={g} className="px-3.5 py-1 rounded-full bg-[#1a1b23] text-gray-300 text-xs font-medium border border-[#2d2f39]">
                  {g}
                </span>
              ))}
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2f39] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Storyline Synopsis</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {currentDrama.synopsis}
              </p>
              {currentDrama.cast && currentDrama.cast.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-400 pt-3 border-t border-[#2d2f39]">
                  <strong className="text-gray-200">Starring:</strong> {currentDrama.cast.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* SIDEBAR DETAILS */}
          <div className="space-y-4">
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2f39] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Series Information</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Original Title</span>
                  <span className="text-white font-medium text-right">{currentDrama.originalTitle || currentDrama.title}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Country / Language</span>
                  <span className="text-white font-medium">{currentDrama.country} ({currentDrama.language})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Total Episodes</span>
                  <span className="text-white font-medium">{currentDrama.episodesCount || '1'} Episodes</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Release Status</span>
                  <span className="text-emerald-400 font-semibold">{currentDrama.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEASONS & EPISODES SECTION (For TV / Anime) */}
        {!isMovie && (
          <div className="space-y-6 pt-6 border-t border-[#2d2f39]">
            
            {/* Season Selector */}
            {currentDrama.seasons && currentDrama.seasons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>Select Season</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {currentDrama.seasons.map((season) => (
                    <button
                      key={season.seasonNumber}
                      onClick={() => handleSeasonChange(season.seasonNumber)}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                        selectedSeason === season.seasonNumber
                          ? 'bg-violet-600 text-white border-violet-500 shadow-xl shadow-violet-600/30'
                          : 'bg-[#121212] text-gray-300 border-[#2d2f39] hover:bg-[#1a1b23]'
                      }`}
                    >
                      {season.name} ({season.episodeCount} Eps)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <span>Season {selectedSeason} Episodes ({seasonEpisodes.length})</span>
                  {isLoadingSeason && <span className="text-xs text-amber-400 animate-pulse">(Loading...)</span>}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Quality Filter:</span>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    aria-label="Select Episode Video Quality"
                    className="bg-[#121212] border border-[#2d2f39] text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="720p / 1080p">720p / 1080p (Best)</option>
                    <option value="1080p FHD">1080p FHD</option>
                    <option value="720p HD">720p HD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {seasonEpisodes.map((ep) => {
                  const isSelected = selectedEpisodeNum === ep.epNum;

                  return (
                    <div
                      key={ep.epNum}
                      onClick={() => {
                        setSelectedEpisodeNum(ep.epNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer group ${
                        isSelected
                          ? 'bg-violet-950/40 border-violet-500/80 shadow-xl shadow-violet-900/20'
                          : 'bg-[#121212] border-[#2d2f39] hover:border-cyan-500/50 hover:bg-[#16171e]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                          isSelected ? 'bg-violet-600 text-white border-violet-500 shadow-md' : 'bg-[#1a1b23] text-cyan-400 border-[#2d2f39]'
                        }`}>
                          {ep.epNum}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
                            <span className="truncate">{ep.title || `Episode ${ep.epNum}`}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex-shrink-0">
                                Playing
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            {ep.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                {ep.duration}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a1b23] text-violet-300 border border-[#2d2f39]">
                              {ep.quality}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEpisodeNum(ep.epNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                          isSelected
                            ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                            : 'bg-[#1a1b23] group-hover:bg-[#252836] text-gray-200 border border-[#2d2f39]'
                        }`}
                      >
                        {isSelected ? '▶ Playing' : 'Watch'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DMCA Disclaimer */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#2d2f39] text-xs text-gray-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-gray-300">Disclaimer:</strong> This application does not host any media files on its servers. All streams and download options are powered by automated embed providers. If any video fails to embed due to sandbox restrictions, simply click the <strong className="text-violet-400">"🚀 Open Stream in New Tab"</strong> button above for uninterrupted full-screen playback.
          </p>
        </div>

      </main>
    </div>
  );
};

