import { Drama, Episode, SeasonInfo, CategoryType } from '../types';
import { DRAMA_DATABASE } from '../data/dramas';

export const TMDB_API_KEY = "10eff5fb3987e79f2ed85855a807ea05";

const tvDetailsCache = new Map<string, any>();
const movieDetailsCache = new Map<string, any>();

function getApiKey() {
  const local = typeof window !== 'undefined' ? localStorage.getItem('tmdb_api_key') : '';
  if (local && local !== "YOUR_KEY_HERE") return local;
  if (TMDB_API_KEY) return TMDB_API_KEY;
  return "";
}

function getTmdbHeaders(apiKey: string) {
  if (apiKey.startsWith('eyJ')) {
    return {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    };
  }
  return {};
}

function getTmdbUrl(endpoint: string, apiKey: string) {
  if (apiKey.startsWith('eyJ')) {
    return `https://api.themoviedb.org/3${endpoint}`;
  }
  const separator = endpoint.includes('?') ? '&' : '?';
  return `https://api.themoviedb.org/3${endpoint}${separator}api_key=${apiKey}`;
}

async function tmdbFetch(endpoint: string) {
  try {
    const res = await fetch(`/api/tmdb${endpoint}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Proxy fallback
  }

  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const url = getTmdbUrl(endpoint, apiKey);
      const options = getTmdbHeaders(apiKey);
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Direct TMDB fetch error:', err);
    }
  }

  return null;
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10765: 'Sci-Fi & Fantasy'
};

function getGenreNames(genreIds: number[]): string[] {
  if (!genreIds || !Array.isArray(genreIds)) return ['Drama', 'Series'];
  const names = genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
  return names.length > 0 ? names : ['Drama', 'Series'];
}

/**
 * TMDB METADATA LOADER
 * Fetches dynamic details for a movie or TV series from TMDb given a tmdbId,
 * automatically populating poster image, backdrop, title, release date, genres, and synopsis.
 */
export async function fetchMovieDetails(tmdbId: number, isMovie: boolean = false): Promise<any> {
  const cacheKey = `${isMovie ? 'movie' : 'tv'}-${tmdbId}`;
  if (tvDetailsCache.has(cacheKey)) {
    return tvDetailsCache.get(cacheKey);
  }

  const endpoint = isMovie ? `/movie/${tmdbId}?language=en-US` : `/tv/${tmdbId}?language=en-US`;
  const data = await tmdbFetch(endpoint);
  if (data) {
    tvDetailsCache.set(cacheKey, data);
    return data;
  }
  return null;
}

export async function fetchSeasonEpisodes(tmdbId: number, seasonNumber: number): Promise<Episode[]> {
  try {
    const data = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNumber}`);
    if (!data || !data.episodes) return [];

    return data.episodes.map((ep: any): Episode => ({
      epNum: ep.episode_number,
      quality: 'HD',
      title: ep.name || `Episode ${ep.episode_number}`,
      duration: ep.runtime ? `${ep.runtime}m` : '45m',
      overview: ep.overview,
      stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : undefined,
      airDate: ep.air_date,
      downloadSources: [
        { name: 'Download Mirror 1', url: `https://mixdrop.co/f/e-${tmdbId}-${seasonNumber}-${ep.episode_number}`, quality: 'HD' },
        { name: 'Download Mirror 2', url: `https://streamwish.to/e/e-${tmdbId}-${seasonNumber}-${ep.episode_number}`, quality: 'HD' },
        { name: 'Download Mirror 3', url: `https://filemoon.sx/d/e-${tmdbId}-${seasonNumber}-${ep.episode_number}`, quality: 'HD' }
      ]
    }));
  } catch (err) {
    console.warn(`Failed to fetch season ${seasonNumber} episodes for ${tmdbId}:`, err);
    return [];
  }
}

/**
 * Enriches a curated Drama item with live TMDb metadata (poster, backdrop, title, release date, genres, synopsis)
 */
export async function enrichCuratedDrama(drama: Drama): Promise<Drama> {
  if (!drama.tmdbId) return drama;

  const isMovie = drama.genres.includes('Movie') || drama.episodesCount === 1;
  const data = await fetchMovieDetails(drama.tmdbId, isMovie);
  if (!data) return drama;

  // Preserve local curated title & visuals unless empty, allowing custom additions (like Love on the Menu)
  const title = drama.title || data.title || data.name;
  const synopsis = drama.synopsis || data.overview;
  const rating = data.vote_average ? Number(data.vote_average.toFixed(1)) : drama.rating;
  const posterUrl = (data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '') || drama.posterUrl;
  const backdropUrl = (data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : '') || drama.backdropUrl;
  const genres = data.genres && data.genres.length > 0 ? data.genres.map((g: { name: string }) => g.name) : drama.genres;
  const year = data.release_date ? new Date(data.release_date).getFullYear() : (data.first_air_date ? new Date(data.first_air_date).getFullYear() : drama.year);

  let seasons: SeasonInfo[] = drama.seasons || [];
  if (!isMovie && data.seasons && data.seasons.length > 0 && (!drama.seasons || drama.seasons.length === 0)) {
    seasons = data.seasons
      .filter((s: any) => s.season_number > 0)
      .map((s: any) => ({
        seasonNumber: s.season_number,
        name: s.name || `Season ${s.season_number}`,
        episodeCount: s.episode_count || 16,
        overview: s.overview,
        posterPath: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined
      }));
  }

  return {
    ...drama,
    title,
    synopsis,
    rating,
    posterUrl,
    backdropUrl,
    genres,
    year,
    seasons: seasons.length > 0 ? seasons : drama.seasons
  };
}

export interface GenreSection {
  title: string;
  subtitle: string;
  dramas: Drama[];
}

/**
 * HOMEPAGE & CATALOG (CURATED ONLY)
 * Renders ONLY from the central local data array/JSON store (DRAMA_DATABASE).
 * No dynamic search index scraping for the catalog.
 */
export async function fetchAllCuratedGenreRows(activeCategory: CategoryType = 'All'): Promise<GenreSection[]> {
  const isMovieCategory = activeCategory === 'K-Movies' || activeCategory === 'Anime-Movies';

  const seriesDatabase = [...DRAMA_DATABASE.filter(item => item.category !== 'K-Movies' && item.category !== 'Anime-Movies')].reverse();
  const moviesDatabase = [...DRAMA_DATABASE.filter(item => item.category === 'K-Movies')].reverse();
  const animeMoviesDatabase = [...DRAMA_DATABASE.filter(item => item.category === 'Anime-Movies')].reverse();
  
  const kDramas = [...DRAMA_DATABASE.filter(item => item.category === 'K-Drama')].reverse();
  const cDramas = [...DRAMA_DATABASE.filter(item => item.category === 'C-Drama')].reverse();
  const jDramas = [...DRAMA_DATABASE.filter(item => item.category === 'J-Drama')].reverse();
  const phDramas = [...DRAMA_DATABASE.filter(item => item.category === 'PH-Drama')].reverse();
  const animeDramas = [...DRAMA_DATABASE.filter(item => item.category === 'Anime')].reverse();

  const filtered = [...DRAMA_DATABASE.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Trending') return item.isTrending;
    return item.category === activeCategory;
  })].reverse();



  if (activeCategory === 'K-Movies') {
    return [
      {
        title: "Feature K-Movies",
        subtitle: "Standalone full-length Korean films.",
        dramas: moviesDatabase
      },
      {
        title: "🔥 Trending K-Movies",
        subtitle: "Top-rated standalone film releases (8.0+ Rating)",
        dramas: moviesDatabase.filter(m => m.isTrending && m.rating >= 8.0)
      }
    ];
  }

  if (activeCategory === 'Anime-Movies') {
    return [
      {
        title: "🌸 Anime Movies Collection",
        subtitle: "Standalone animated feature films & masterpieces.",
        dramas: animeMoviesDatabase
      },
      {
        title: "🔥 Trending Anime Movies",
        subtitle: "Top-rated animated feature films (8.0+ Rating)",
        dramas: animeMoviesDatabase.filter(m => m.isTrending && m.rating >= 8.0)
      }
    ];
  }

  const trending = [...seriesDatabase.filter(item => item.isTrending && item.category !== 'Anime' && item.category !== 'Anime-Movies' && item.rating >= 8.0)];
  const trendingMovies = [...moviesDatabase.filter(m => m.isTrending && m.rating >= 8.0)];
  const trendingAnimeMovies = [...animeMoviesDatabase.filter(m => m.isTrending && m.rating >= 8.0)];

  if (activeCategory === 'Trending') {
    return [
      {
        title: "🔥 Trending Series & Shows",
        subtitle: "Verified direct download links for top-rated K-Dramas & C-Dramas (8.0+ Rating)",
        dramas: trending
      },
      {
        title: "🔥 Trending K-Movies",
        subtitle: "Top-rated standalone feature films (8.0+ Rating)",
        dramas: trendingMovies
      },
      {
        title: "🔥 Trending Anime Movies",
        subtitle: "Top-rated anime feature films (8.0+ Rating)",
        dramas: trendingAnimeMovies
      }
    ];
  }

  if (activeCategory === 'All') {
    const sections: GenreSection[] = [
      {
        title: "🔥 Curated Trending Series",
        subtitle: "Verified direct download links.",
        dramas: trending
      },
      {
        title: "Feature K-Movies",
        subtitle: "Standalone full-length Korean films.",
        dramas: moviesDatabase
      },
      {
        title: "🇰🇷 Popular K-Dramas",
        subtitle: "Top-rated Korean drama series",
        dramas: kDramas
      },
      {
        title: "🇨🇳 Popular C-Dramas",
        subtitle: "Top-rated Chinese drama series",
        dramas: cDramas
      }
    ];

    if (jDramas.length > 0) {
      sections.push({
        title: "🇯🇵 Popular J-Dramas (Japanese)",
        subtitle: "Top-rated Japanese series & mysteries",
        dramas: jDramas
      });
    }

    if (phDramas.length > 0) {
      sections.push({
        title: "🇵🇭 Popular Philippine Series",
        subtitle: "Top-rated Philippine drama and comedy series",
        dramas: phDramas
      });
    }

    if (animeDramas.length > 0) {
      sections.push({
        title: "🌸 Anime Series",
        subtitle: "Masterpieces with multi-quality mobile & HD downloads",
        dramas: animeDramas
      });
    }

    if (animeMoviesDatabase.length > 0) {
      sections.push({
        title: "🌸 Anime Movies",
        subtitle: "Standalone animated feature films & theatrical masterpieces",
        dramas: animeMoviesDatabase
      });
    }

    // Fully automated dynamic genre grouping based on TMDb / database genres
    const allGenres = Array.from(new Set(DRAMA_DATABASE.flatMap(d => d.genres)));
    const genreTitles: Record<string, { title: string; subtitle: string }> = {
      'Romance': { title: '💖 Romance & Melodrama', subtitle: 'Heartfelt emotional journeys & love stories' },
      'Melodrama': { title: '💖 Romance & Melodrama', subtitle: 'Heartfelt emotional journeys & love stories' },
      'Action': { title: '⚔️ Action & Blockbusters', subtitle: 'High-octane excitement and heroics' },
      'Fantasy': { title: '🔮 Fantasy & Supernatural', subtitle: 'Magical realms and otherworldly tales' },
      'Comedy': { title: '😂 Comedy & Slice of Life', subtitle: 'Laughs, lighthearted moments and everyday joy' },
      'Crime': { title: '🕵️ Crime, Thriller & Mystery', subtitle: 'Edge-of-your-seat suspense and investigations' },
      'Thriller': { title: '🕵️ Crime, Thriller & Mystery', subtitle: 'Edge-of-your-seat suspense and investigations' },
      'Mystery': { title: '🕵️ Crime, Thriller & Mystery', subtitle: 'Edge-of-your-seat suspense and investigations' },
      'Science Fiction': { title: '🚀 Sci-Fi & Space', subtitle: 'Futuristic worlds and cosmic adventures' },
      'Documentary': { title: '🎥 Documentary & Real Life', subtitle: 'Fascinating true stories and insights' },
      'Horror': { title: '😱 Horror & Dark Suspense', subtitle: 'Spine-chilling and terrifying encounters' }
    };

    const processedTitles = new Set<string>();
    for (const g of allGenres) {
      const config = genreTitles[g] || { title: `✨ ${g} Collection`, subtitle: `Top-rated ${g} titles automatically categorized` };
      if (!processedTitles.has(config.title)) {
        processedTitles.add(config.title);
        const matchingDramas = [...DRAMA_DATABASE.filter(item => item.genres.includes(g))].reverse();
        if (matchingDramas.length > 0) {
          sections.push({
            title: config.title,
            subtitle: config.subtitle,
            dramas: matchingDramas
          });
        }
      }
    }

    return sections;
  }

  return [
    {
      title: `📦 ${activeCategory} Collection`,
      subtitle: `Complete curated collection of ${activeCategory} titles`,
      dramas: filtered
    }
  ];
}
