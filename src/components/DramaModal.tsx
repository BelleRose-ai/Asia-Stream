import React, { useState } from 'react';
import { X, Star, Calendar, Globe, Film, Download, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Drama, Episode } from '../types';

interface DramaModalProps {
  drama: Drama;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const DramaModal: React.FC<DramaModalProps> = ({ drama, onClose, onOpenTelegram }) => {
  const [selectedQuality, setSelectedQuality] = useState<string>('720p / 1080p');
  const [downloadingEp, setDownloadingEp] = useState<number | null>(null);

  const handleDownloadClick = (ep: Episode) => {
    if (!ep.downloadUrl) {
      onOpenTelegram();
      return;
    }

    setDownloadingEp(ep.epNum);
    // Simulate ad click / direct link redirection or open download link
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
            src={drama.backdropUrl}
            alt={drama.title}
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
              <img src={drama.posterUrl} alt={drama.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-violet-600 text-white">
                  {drama.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                  {drama.rating} Rating
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs text-gray-300 bg-[#1a1b23]/80 border border-[#2d2f39]">
                  {drama.year}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                  {drama.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">
                {drama.title}
              </h2>
              <p className="text-xs text-gray-300">
                {drama.country} • {drama.language} • {drama.episodesCount} Episodes
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Metadata Chips & Genres */}
          <div className="flex flex-wrap gap-2">
            {drama.genres.map((g) => (
              <span key={g} className="px-3 py-1 rounded-full bg-[#1a1b23] text-gray-300 text-xs border border-[#2d2f39]">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="bg-[#1a1b23]/60 p-4 rounded-xl border border-[#2d2f39] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">Storyline Synopsis</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {drama.synopsis}
            </p>
            {drama.cast && drama.cast.length > 0 && (
              <p className="text-xs text-gray-400 pt-2 border-t border-[#2d2f39]/50">
                <strong className="text-gray-300">Starring:</strong> {drama.cast.join(', ')}
              </p>
            )}
          </div>

          {/* Ad Slot Placeholder (Monetag / Adsterra SmartLink or Banner) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-[#1a1b23] to-cyan-950/40 border border-violet-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Sponsored Ad Space</span>
              <p className="text-xs text-gray-300">Support our free portal by exploring our sponsor offers or joining Telegram.</p>
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
                <span>Episodes & Cloud Downloads ({drama.episodes.length})</span>
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
            <div className="space-y-2.5">
              {drama.episodes.map((ep) => {
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
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          {ep.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              {ep.duration}
                            </span>
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
                          <span>Uploading Soon (Request on Telegram)</span>
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
