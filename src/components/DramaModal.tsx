import React, { useState, useEffect } from 'react';
import { X, Star, Film, Download, Send, Clock, AlertCircle, Layers } from 'lucide-react';
import { Drama, Episode } from '../types';
import { fetchTmdbMetadata, fetchSeasonEpisodes } from '../services/tmdb';

interface DramaModalProps {
  drama: Drama;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const DramaModal: React.FC<DramaModalProps> = ({ drama, onClose, onOpenTelegram }) => {
  const [currentDrama, setCurrentDrama] = useState<Drama>(drama);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>(drama.episodes || []);
  const [isLoadingSeason, setIsLoadingSeason] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('720p / 1080p');
  const [downloadingEp, setDownloadingEp] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (drama.tmdbId) {
      setIsLoadingDetails(true);
      fetchTmdbMetadata(drama)
        .then(updated => {
          if (isMounted) {
            setCurrentDrama(updated);
            if (updated.seasons && updated.seasons.length > 0) {
              const firstSeasonNum = updated.seasons[0].seasonNumber;
              setSelectedSeason(firstSeasonNum);
              if (updated.seasons[0].episodeCount > 0 && updated.episodes.length > 0) {
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

  // When season changes, fetch actual episodes for that season
  const handleSeasonChange = async (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    if (!currentDrama.tmdbId) return;

    setIsLoadingSeason(true);
    const eps = await fetchSeasonEpisodes(currentDrama.tmdbId, seasonNum);
    if (eps.length > 0) {
      setSeasonEpisodes(eps);
    } else {
      // Fallback generator if empty season
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121212] border border-[#2d2f39] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-900 flex-shrink-0">
          <img
            src={currentDrama.backdropUrl}
            alt={currentDrama.title}
            className="w-full h-full object-cover object-center opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#1a1b23]/80 hover:bg-[#2d2f39] text-white border border-[#2d2f39] backdrop-blur-md transition-all shadow-lg"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Info on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="hidden sm:block w-28 h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-[#2d2f39] flex-shrink-0">
              <img src={currentDrama.posterUrl} alt={currentDrama.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-violet-600 text-white">
                  {currentDrama.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                  {currentDrama.rating} Rating
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs text-gray-300 bg-[#1a1b23]/80 border border-[#2d2f39]">
                  {currentDrama.year}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                  {currentDrama.status}
                </span>
                {isLoadingDetails && (
                  <span className="px-2.5 py-0.5 rounded text-xs text-amber-300 bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Fetching Seasons...
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">
                {currentDrama.title}
              </h2>
              <p className="text-xs text-gray-300">
                {currentDrama.country} • {currentDrama.language} • {currentDrama.seasons?.length || 1} Seasons ({currentDrama.episodesCount} Total Episodes)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Metadata Chips & Genres */}
          <div className="flex flex-wrap gap-2">
            {currentDrama.genres.map((g) => (
              <span key={g} className="px-3 py-1 rounded-full bg-[#1a1b23] text-gray-300 text-xs border border-[#2d2f39]">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="bg-[#1a1b23]/60 p-4 rounded-xl border border-[#2d2f39] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">Storyline Synopsis</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {currentDrama.synopsis}
            </p>
            {currentDrama.cast && currentDrama.cast.length > 0 && (
              <p className="text-xs text-gray-400 pt-2 border-t border-[#2d2f39]/50">
                <strong className="text-gray-300">Starring:</strong> {currentDrama.cast.join(', ')}
              </p>
            )}
          </div>

          {/* Seasons Selector Tab Bar */}
          {currentDrama.seasons && currentDrama.seasons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Select Season:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentDrama.seasons.map((season) => (
                  <button
                    key={season.seasonNumber}
                    onClick={() => handleSeasonChange(season.seasonNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedSeason === season.seasonNumber
                        ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/30'
                        : 'bg-[#1a1b23] text-gray-300 border-[#2d2f39] hover:bg-[#252836]'
                    }`}
                  >
                    {season.name} ({season.episodeCount} Eps)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ad Slot Placeholder */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-[#1a1b23] to-cyan-950/40 border border-violet-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Sponsored Ad Space</span>
              <p className="text-xs text-gray-300">Support our free portal by exploring sponsor offers or joining Telegram.</p>
            </div>
            <button
              onClick={onOpenTelegram}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold whitespace-nowrap shadow transition-all flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Request Link</span>
            </button>
          </div>

          {/* Episode Download Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Season {selectedSeason} Episodes ({seasonEpisodes.length})</span>
                {isLoadingSeason && <span className="text-xs text-amber-400 animate-pulse">(Loading...)</span>}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">Quality:</span>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  aria-label="Select Episode Video Quality"
                  className="bg-[#1a1b23] border border-[#2d2f39] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="720p / 1080p">720p / 1080p (Best)</option>
                  <option value="1080p FHD">1080p FHD</option>
                  <option value="720p HD">720p HD</option>
                  <option value="480p SD">480p SD (Data Saver)</option>
                </select>
              </div>
            </div>

            {/* Episode List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {seasonEpisodes.map((ep) => {
                const hasLink = Boolean(ep.downloadUrl);
                const isDownloading = downloadingEp === ep.epNum;

                return (
                  <div
                    key={ep.epNum}
                    className="p-3.5 bg-[#1a1b23] rounded-xl border border-[#2d2f39] hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#121212] border border-[#2d2f39] flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                        {ep.epNum}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {ep.title || `Episode ${ep.epNum}`}
                        </h4>
                        {ep.overview && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                            {ep.overview}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          {ep.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              {ep.duration}
                            </span>
                          )}
                          {ep.airDate && (
                            <span className="text-gray-500">{ep.airDate}</span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-[#121212] text-violet-300 border border-[#2d2f39] text-[10px]">
                            {ep.quality} • Eng Sub
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full sm:w-auto flex items-center justify-end">
                      {hasLink ? (
                        <button
                          onClick={() => handleDownloadClick(ep)}
                          disabled={isDownloading}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                        >
                          {isDownloading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Preparing Link...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download / Stream</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={onOpenTelegram}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-amber-400 border border-amber-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Request on Telegram</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DMCA / Info Notice */}
          <div className="p-4 rounded-xl bg-[#1a1b23]/40 border border-[#2d2f39] text-xs text-gray-400 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-gray-300">Disclaimer:</strong> This site does not host any files on its servers. All contents are provided by non-affiliated third parties. If you encounter missing links, please request them in our official Telegram channel.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
