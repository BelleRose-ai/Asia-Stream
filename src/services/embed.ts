/**
 * Multi-Provider Video Streaming & Download Services (VidSrc, AutoEmbed, etc.)
 */

export type EmbedProvider = 'vidsrc.to' | 'vidsrc.cc' | 'autoembed.co' | 'vidsrc.icu';

export const PROVIDER_LABELS: Record<EmbedProvider, string> = {
  'vidsrc.to': 'Server 1: VidSrc.to (HD)',
  'vidsrc.cc': 'Server 2: VidSrc.cc (Backup 1)',
  'autoembed.co': 'Server 3: AutoEmbed (Backup 2)',
  'vidsrc.icu': 'Server 4: VidSrc.icu (Backup 3)'
};

/**
 * Generates streaming/playback URL for movies using TMDB ID and selected provider.
 */
export const getEmbedMovieUrl = (tmdbId: string | number, provider: EmbedProvider = 'vidsrc.to'): string => {
  switch (provider) {
    case 'vidsrc.to':
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    case 'vidsrc.cc':
      return `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
    case 'autoembed.co':
      return `https://autoembed.co/embed/movie/${tmdbId}`;
    case 'vidsrc.icu':
      return `https://vidsrc.icu/embed/movie/${tmdbId}`;
    default:
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
  }
};

/**
 * Generates streaming/playback URL for TV series and anime episodes using TMDB ID, Season, Episode, and provider.
 */
export const getEmbedTvUrl = (
  tmdbId: string | number,
  season: number,
  episode: number,
  provider: EmbedProvider = 'vidsrc.to'
): string => {
  switch (provider) {
    case 'vidsrc.to':
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
    case 'vidsrc.cc':
      return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`;
    case 'autoembed.co':
      return `https://autoembed.co/embed/tv/${tmdbId}/${season}/${episode}`;
    case 'vidsrc.icu':
      return `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
    default:
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
  }
};

// Backwards-compatible aliases
export const getAutoEmbedMovieUrl = (tmdbId: string | number): string => getEmbedMovieUrl(tmdbId, 'vidsrc.to');
export const getAutoEmbedTvUrl = (tmdbId: string | number, season: number, episode: number): string => getEmbedTvUrl(tmdbId, season, episode, 'vidsrc.to');
