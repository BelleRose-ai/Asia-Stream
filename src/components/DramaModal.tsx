import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Download, Film, Sparkles, MessageSquare, Send, CheckCircle2, ShieldCheck, HardDrive, Flag } from 'lucide-react';
import { Drama, Episode, CommentItem, DownloadSource } from '../types';
import { fetchMovieDetails, fetchSeasonEpisodes, enrichCuratedDrama } from '../services/tmdb';
import { DownloadConfirmModal, PendingDownload, parseServerName } from './DownloadConfirmModal';
import { ReportModal } from './ReportModal';
import { AdBanner } from './AdBanner';

interface DramaModalProps {
  drama: Drama;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const DramaModal: React.FC<DramaModalProps> = ({ drama, onClose, onOpenTelegram }) => {
  const [currentDrama, setCurrentDrama] = useState<Drama>(drama);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>(drama.episodes || []);
  const [isLoadingSeason, setIsLoadingSeason] = useState<boolean>(false);
  const [pendingDownload, setPendingDownload] = useState<PendingDownload | null>(null);
  const [reportEpisode, setReportEpisode] = useState<{ epNum: number; title?: string } | null>(null);

  // Comment & Request form state
  const [comments, setComments] = useState<CommentItem[]>(drama.comments || [
    { id: '1', name: 'K-Drama Fan 99', comment: 'Thanks for uploading the 720p mirror! Works like a charm.', date: '3 hours ago' },
    { id: '2', name: 'Alex M.', comment: 'Please upload batch subtitles for episode 12 when you get a chance!', date: 'Yesterday' }
  ]);
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [commentSubmitted, setCommentSubmitted] = useState<boolean>(false);

  const isMovie = currentDrama.genres.includes('Movie') || currentDrama.episodesCount === 1;

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoadingDetails(true);

    enrichCuratedDrama(drama)
      .then(enriched => {
        if (isMounted) {
          setCurrentDrama(enriched);
          if (enriched.seasons && enriched.seasons.length > 0) {
            const firstSeasonNum = enriched.seasons[0].seasonNumber;
            setSelectedSeason(firstSeasonNum);
          }
          setIsLoadingDetails(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingDetails(false);
      });

    return () => { isMounted = false; };
  }, [drama]);

  const handleSeasonChange = async (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    if (!currentDrama.tmdbId || isMovie) return;

    setIsLoadingSeason(true);
    const eps = await fetchSeasonEpisodes(currentDrama.tmdbId, seasonNum);
    if (eps.length > 0) {
      setSeasonEpisodes(eps);
    }
    setIsLoadingSeason(false);
  };

  const handleInitiateDownload = (source: DownloadSource, itemTitle?: string) => {
    const serverName = parseServerName(source.url, source.name);
    setPendingDownload({
      source,
      itemTitle: itemTitle || currentDrama.title,
      serverName
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      name: newCommentName.trim(),
      comment: newCommentText.trim(),
      date: 'Just now'
    };

    setComments([newComment, ...comments]);
    setNewCommentName('');
    setNewCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] overflow-y-auto animate-fade-in">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-[#2d2f39] px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-white border border-[#2d2f39] flex items-center gap-2 text-sm font-semibold transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Curated Catalog</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600 text-white shadow">
            {currentDrama.category}
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Verified Direct Downloads
          </span>
        </div>
      </header>

      {/* Hero Backdrop Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900 flex-shrink-0 border-b border-[#2d2f39]">
        <img
          src={currentDrama.backdropUrl}
          alt={currentDrama.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
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
              <span className="px-3 py-1 rounded-md text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Active Links
              </span>
              {isLoadingDetails && (
                <span className="px-3 py-1 rounded-md text-xs text-amber-300 bg-amber-500/25 border border-amber-500/30 animate-pulse">
                  Loading TMDb Metadata...
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {currentDrama.title}
            </h1>
            {currentDrama.originalTitle && (
              <p className="text-xs sm:text-sm font-medium text-gray-400">
                {currentDrama.originalTitle} • {currentDrama.country === 'China' || currentDrama.language === 'Chinese' ? 'China • Mandarin' : `${currentDrama.country} • ${currentDrama.language}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* MOVIE / BATCH DOWNLOAD SECTION */}
        {isMovie && currentDrama.downloadSources && currentDrama.downloadSources.length > 0 && (
          <div className="bg-[#121212] rounded-3xl border border-[#2d2f39] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#2d2f39] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Direct Download Mirrors</h2>
                  <p className="text-xs text-gray-400">Click any mirror below to start downloading instantly</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                100% Verified Safe
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentDrama.downloadSources.map((source, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInitiateDownload(source, `${currentDrama.title} (Feature Film)`)}
                  className="p-4 rounded-2xl bg-[#1a1b23] hover:bg-[#252836] border border-[#2d2f39] hover:border-emerald-500/60 transition-all flex items-center justify-between group shadow-lg text-left cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      {source.quality || 'High Quality'}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {source.name}
                    </h3>
                    {source.size && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-gray-500" />
                        {source.size}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center flex-shrink-0 shadow">
                    <Download className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SYNOPSIS & INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              {currentDrama.genres.map((g) => (
                <span key={g} className="px-3.5 py-1 rounded-full bg-[#1a1b23] text-gray-300 text-xs font-medium border border-[#2d2f39]">
                  {g}
                </span>
              ))}
            </div>

            <div className="bg-[#121212] p-6 sm:p-8 rounded-3xl border border-[#2d2f39] space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Storyline Synopsis</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {currentDrama.synopsis}
              </p>
              {currentDrama.cast && currentDrama.cast.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-400 pt-4 border-t border-[#2d2f39]">
                  <strong className="text-gray-200">Starring Cast:</strong> {currentDrama.cast.join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2f39] space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Release Details</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Original Title</span>
                  <span className="text-white font-medium text-right">{currentDrama.originalTitle || currentDrama.title}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Country / Lang</span>
                  <span className="text-white font-medium">{currentDrama.country} ({currentDrama.language})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2d2f39]/60">
                  <span className="text-gray-400">Total Count</span>
                  <span className="text-white font-medium">{currentDrama.episodesCount || '1'} Episodes</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Status</span>
                  <span className="text-emerald-400 font-semibold">{currentDrama.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EPISODES & SEASONS LIST (For TV / Anime) */}
        {!isMovie && (
          <div className="space-y-6 pt-6 border-t border-[#2d2f39]">
            
            {/* Season Tabs */}
            {currentDrama.seasons && currentDrama.seasons.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-violet-400" />
                  <span>Select Season</span>
                </h3>
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

            {/* Native Banner Ad (Centered) */}
            <AdBanner type="native" className="my-4" />

            {/* Episode Cards with Download Sources */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <span>Episode Download Links ({seasonEpisodes.length})</span>
                {isLoadingSeason && <span className="text-xs text-amber-400 animate-pulse">(Loading...)</span>}
              </h3>

              <div className="space-y-3">
                {seasonEpisodes.map((ep) => (
                  <div
                    key={ep.epNum}
                    className="p-5 rounded-2xl bg-[#121212] border border-[#2d2f39] hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#1a1b23] border border-[#2d2f39] text-emerald-400 flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow">
                        {ep.epNum}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {ep.title || `Episode ${ep.epNum}`}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {ep.overview || `${currentDrama.title} Season ${selectedSeason} Episode ${ep.epNum}`}
                        </p>
                      </div>
                    </div>

                    {/* Episode Download Buttons & Report Link */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {ep.downloadSources && ep.downloadSources.length > 0 ? (
                          ep.downloadSources.map((ds, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleInitiateDownload(ds, `${currentDrama.title} - Season ${selectedSeason} Ep ${ep.epNum}`)}
                              className="px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-emerald-600 text-gray-200 hover:text-white border border-[#2d2f39] hover:border-emerald-500 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer group"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                              <span>{ds.name}</span>
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => handleInitiateDownload({ name: 'Download 720p (Mixdrop)', url: 'https://mixdrop.co', quality: '720p' }, `${currentDrama.title} - Season ${selectedSeason} Ep ${ep.epNum}`)}
                            className="px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-emerald-600 text-gray-200 hover:text-white border border-[#2d2f39] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer group"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                            <span>Download 720p</span>
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setReportEpisode({ epNum: ep.epNum, title: ep.title })}
                        className="text-[11px] text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#1a1b23]"
                        title="Report broken or dead link"
                      >
                        <Flag className="w-3 h-3 text-amber-500/80" />
                        <span>Report Dead Link</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 300x250 Rectangle Ad Banner with generous margin from download section */}
            <AdBanner type="300x250" className="mt-8 mb-6" />
          </div>
        )}

        {/* COMMENT & REQUEST SECTION */}
        <div className="space-y-6 pt-8 border-t border-[#2d2f39]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Community Feedback & Episode Requests</h3>
            </div>
            <span className="text-xs text-gray-400">{comments.length} comments</span>
          </div>

          {/* Comment Submission Form */}
          <form onSubmit={handleAddComment} className="bg-[#121212] p-6 rounded-3xl border border-[#2d2f39] space-y-4 shadow-xl">
            {commentSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your comment/request has been posted successfully!</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name or Username"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                required
                className="bg-[#1a1b23] border border-[#2d2f39] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Leave feedback, report a broken link, or request a missing drama/episode..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
              className="w-full bg-[#1a1b23] border border-[#2d2f39] text-white rounded-xl p-4 text-xs focus:outline-none focus:border-cyan-500 font-medium resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment / Request</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-[#121212] border border-[#2d2f39] space-y-1.5 shadow">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{c.name}</span>
                  <span className="text-gray-500 text-[11px]">{c.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Clean Download Confirmation Modal */}
      <DownloadConfirmModal
        pendingDownload={pendingDownload}
        onClose={() => setPendingDownload(null)}
      />

      {/* Report Dead Link Modal */}
      <ReportModal
        isOpen={!!reportEpisode}
        onClose={() => setReportEpisode(null)}
        dramaTitle={currentDrama.title}
        defaultEpisode={reportEpisode ? `Episode ${reportEpisode.epNum}${reportEpisode.title ? ` - ${reportEpisode.title}` : ''}` : '1'}
      />
    </div>
  );
};
