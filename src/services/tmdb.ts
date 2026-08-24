import { Drama, CategoryType, Episode, SeasonInfo } from '../types';

export const TMDB_API_KEY = "10eff5fb3987e79f2ed85855a807ea05";

// Module-level cache for TV details to prevent redundant API requests and ensure episode counts are cached
const tvDetailsCache = new Map<number, any>();

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
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

function getGenreNames(genreIds: number[]): string[] {
  if (!genreIds || !Array.isArray(genreIds)) return ['Drama', 'Series'];
  const names = genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
  return names.length > 0 ? names : ['Drama', 'Series'];
}

export async function fetchSeasonEpisodes(tmdbId: number, seasonNumber: number): Promise<Episode[]> {
  try {
    const data = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNumber}`);
    if (!data || !data.episodes) return [];

    return data.episodes.map((ep: any): Episode => ({
      epNum: ep.episode_number,
      quality: '1080p FHD',
      downloadUrl: `https://streamwish.to/tmdb-${tmdbId}-s${seasonNumber}e${ep.episode_number}`,
      title: ep.name || `Episode ${ep.episode_number}`,
      duration: ep.runtime ? `${ep.runtime}m` : '45m',
      overview: ep.overview,
      stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : undefined,
      airDate: ep.air_date
    }));
  } catch (err) {
    console.warn(`Failed to fetch season ${seasonNumber} for TV ID ${tmdbId}:`, err);
    return [];
  }
}

export async function fetchTvDetails(tmdbId: number): Promise<any> {
  if (tvDetailsCache.has(tmdbId)) {
    return tvDetailsCache.get(tmdbId);
  }
  try {
    const data = await tmdbFetch(`/tv/${tmdbId}?language=en-US`);
    if (data) {
      tvDetailsCache.set(tmdbId, data);
      return data;
    }
  } catch (err) {
    console.warn(`Failed to fetch TV details for ID ${tmdbId}:`, err);
  }
  return null;
}

export async function fetchTmdbMetadata(drama: Drama): Promise<Drama> {
  if (!drama.tmdbId) {
    return drama;
  }

  const isMovie = drama.genres.includes('Movie') || drama.episodesCount === 1 || (drama.genres && drama.genres.includes('Blockbuster'));

  try {
    if (isMovie) {
      const data = await tmdbFetch(`/movie/${drama.tmdbId}?language=en-US`);
      if (!data) return drama;

      const movieEpisode: Episode = {
        epNum: 1,
        quality: '1080p FHD',
        downloadUrl: `https://streamwish.to/tmdb-movie-${drama.tmdbId}`,
        title: data.title || drama.title,
        duration: data.runtime ? `${data.runtime}m` : '2h 00m',
        overview: data.overview
      };

      return {
        ...drama,
        title: data.title || drama.title,
        synopsis: data.overview || drama.synopsis,
        rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : drama.rating,
        posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : drama.posterUrl,
        backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : drama.backdropUrl,
        genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : drama.genres,
        year: data.release_date ? new Date(data.release_date).getFullYear() : drama.year,
        episodesCount: 1,
        episodes: [movieEpisode]
      };
    } else {
      const data = await fetchTvDetails(drama.tmdbId);
      if (!data) return drama;

      const seasons: SeasonInfo[] = (data.seasons || [])
        .filter((s: any) => s.season_number >= 0)
        .map((s: any) => ({
          seasonNumber: s.season_number,
          name: s.name || `Season ${s.season_number}`,
          episodeCount: s.episode_count || 0,
          overview: s.overview,
          posterPath: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined
        }));

      const defaultSeasonNum = seasons.length > 0 ? seasons[0].seasonNumber : 1;
      const initialEpisodes = await fetchSeasonEpisodes(drama.tmdbId, defaultSeasonNum);

      const episodesCount = data.number_of_episodes || initialEpisodes.length || 0;
      const finalEpisodes = initialEpisodes.length > 0 ? initialEpisodes : Array.from({ length: episodesCount || 1 }, (_, i) => ({
        epNum: i + 1,
        quality: '1080p FHD',
        downloadUrl: `https://streamwish.to/tmdb-${drama.tmdbId}-s${defaultSeasonNum}e${i + 1}`,
        title: `Episode ${i + 1}`,
        duration: '45m'
      }));

      return {
        ...drama,
        title: data.name || data.title || drama.title,
        synopsis: data.overview || drama.synopsis,
        rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : drama.rating,
        posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : drama.posterUrl,
        backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : drama.backdropUrl,
        genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : drama.genres,
        year: data.first_air_date ? new Date(data.first_air_date).getFullYear() : drama.year,
        episodesCount,
        seasons,
        episodes: finalEpisodes
      };
    }
  } catch (err) {
    console.warn('TMDB fetch metadata failed:', err);
    return drama;
  }
}

export async function searchTmdbLive(query: string): Promise<Drama[]> {
  if (!query.trim()) return [];

  try {
    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`);
    if (!data || !data.results) return [];

    return parseResults(data.results);
  } catch (err) {
    console.error('TMDB live search error:', err);
    return [];
  }
}

async function parseResults(results: any[], categoryHint?: CategoryType, isMovieRow: boolean = false): Promise<Drama[]> {
  const filtered = (results || []).filter((item: any) => {
    const origLang = item.original_language;
    const isAsian = origLang === 'ko' || origLang === 'zh' || origLang === 'ja';
    return isAsian && (item.media_type === 'tv' || item.media_type === 'movie' || item.first_air_date || item.release_date || item.name || item.title);
  });

  // Deduplicate by TMDB ID within the category/row
  const seenIds = new Set<number>();
  const uniqueItems = filtered.filter((item: any) => {
    if (!item.id || seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  // For TV series, batch fetch /tv/{id} details to get actual number_of_episodes and prevent 0 episodes
  const tvItems = uniqueItems.filter((item: any) => !isMovieRow && (item.media_type === 'tv' || !item.media_type));
  const tvIdsToFetch = tvItems.map((item: any) => item.id).filter((id: number) => !tvDetailsCache.has(id));

  if (tvIdsToFetch.length > 0) {
    await Promise.all(tvIdsToFetch.map(id => fetchTvDetails(id)));
  }

  return uniqueItems.map((item: any): Drama => {
    const isMovie = isMovieRow || item.media_type === 'movie' || (!item.media_type && !item.number_of_episodes && item.title && !item.name);
    const title = item.name || item.title || 'Untitled';
    const origLang = item.original_language || 'ko';
    
    let category: 'K-Drama' | 'C-Drama' | 'Anime' = 'K-Drama';
    if (origLang === 'zh') category = 'C-Drama';
    else if (origLang === 'ja') category = 'Anime';
    else category = 'K-Drama';

    let episodesCount = isMovie ? 1 : 0;
    if (!isMovie && item.id) {
      const cachedDetails = tvDetailsCache.get(item.id);
      if (cachedDetails && cachedDetails.number_of_episodes) {
        episodesCount = cachedDetails.number_of_episodes;
      } else if (item.number_of_episodes) {
        episodesCount = item.number_of_episodes;
      }
    }

    // Preserve actual TMDB genres from item.genre_ids instead of overwriting with [category, 'Series']
    const tmdbGenres = getGenreNames(item.genre_ids);

    return {
      id: `tmdb-${item.id}`,
      tmdbId: item.id,
      title,
      originalTitle: item.original_name || item.original_title,
      category,
      isTrending: (item.vote_average || 0) >= 7.0,
      year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : (item.release_date ? new Date(item.release_date).getFullYear() : 2024),
      episodesCount,
      status: 'Completed',
      language: origLang === 'ko' ? 'Korean' : origLang === 'zh' ? 'Mandarin' : origLang === 'ja' ? 'Japanese' : 'Asian',
      country: origLang === 'ko' ? 'South Korea' : origLang === 'zh' ? 'China' : origLang === 'ja' ? 'Japan' : 'Asia',
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.0,
      genres: tmdbGenres,
      synopsis: item.overview || 'No synopsis available from TMDB.',
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
      cast: ['Lead Actor', 'Co-Star'],
      episodes: [],
      views: `${(Math.random() * 5 + 1).toFixed(1)}M`
    };
  });
}

export interface GenreSection {
  title: string;
  subtitle: string;
  dramas: Drama[];
}

export async function fetchAllGenreRows(activeCategory: CategoryType = 'All'): Promise<GenreSection[]> {
  try {
    let langParam = 'ko,zh,ja';
    if (activeCategory === 'K-Drama') langParam = 'ko';
    else if (activeCategory === 'C-Drama') langParam = 'zh';
    else if (activeCategory === 'Anime') langParam = 'ja';

    // Fetch pages 1 and 2 for each category in parallel to ensure >= 14 genuine items
    const [
      koTv1, koTv2,
      zhTv1, zhTv2,
      romance1, romance2,
      action1, action2,
      anime1, anime2,
      movie1, movie2
    ] = await Promise.all([
      tmdbFetch(`/discover/tv?with_original_language=ko&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/tv?with_original_language=ko&sort_by=popularity.desc&page=2`),
      tmdbFetch(`/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=2`),
      tmdbFetch(`/discover/tv?with_genres=10749&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/tv?with_genres=10749&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=2`),
      // Use correct TV genre ID 10759 (Action & Adventure) for TV Action, NOT movie genre ID 28
      tmdbFetch(`/discover/tv?with_genres=10759&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/tv?with_genres=10759&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=2`),
      tmdbFetch(`/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=2`),
      // For movies, use movie genre ID 28 (Action) or 10749 (Romance) / general discover/movie
      tmdbFetch(`/discover/movie?with_genres=28,10749&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=1`),
      tmdbFetch(`/discover/movie?with_genres=28,10749&with_original_language=${encodeURIComponent(langParam)}&sort_by=popularity.desc&page=2`)
    ]);

    const filterByCategory = (results: any[], requiredGenreId?: number) => (results || []).filter((item: any) => {
      const lang = item.original_language;
      const isAsian = lang === 'ko' || lang === 'zh' || lang === 'ja';
      if (!isAsian) return false;

      if (activeCategory === 'K-Drama' && lang !== 'ko') return false;
      if (activeCategory === 'C-Drama' && lang !== 'zh') return false;
      if (activeCategory === 'Anime' && lang !== 'ja') return false;

      if (requiredGenreId) {
        const genreIds = item.genre_ids || [];
        if (!genreIds.includes(requiredGenreId)) return false;
      }

      return true;
    });

    const trendingRaw = [
      ...(filterByCategory(koTv1?.results || [])),
      ...(filterByCategory(zhTv1?.results || [])),
      ...(filterByCategory(koTv2?.results || [])),
      ...(filterByCategory(zhTv2?.results || []))
    ];

    // Romance category validation: must contain genre 10749
    const romanceRaw = [
      ...(filterByCategory(romance1?.results || [], 10749)),
      ...(filterByCategory(romance2?.results || [], 10749))
    ];

    // Action TV category validation: must contain genre 10759 (Action & Adventure)
    const actionRaw = [
      ...(filterByCategory(action1?.results || [], 10759)),
      ...(filterByCategory(action2?.results || [], 10759))
    ];

    // Anime category validation: must contain genre 16 or original language ja
    const animeRaw = [
      ...(filterByCategory(anime1?.results || [], 16)),
      ...(filterByCategory(anime2?.results || [], 16))
    ];

    const movieRaw = [
      ...(filterByCategory(movie1?.results || [])),
      ...(filterByCategory(movie2?.results || []))
    ];

    const [row1Dramas, row2Dramas, row3Dramas, row4Dramas, row5Dramas] = await Promise.all([
      parseResults(trendingRaw),
      parseResults(romanceRaw),
      parseResults(actionRaw),
      parseResults(animeRaw, 'Anime'),
      parseResults(movieRaw, undefined, true)
    ]);

    const fallbackDramas = row1Dramas.length >= 10 ? row1Dramas : await parseResults(filterByCategory(koTv1?.results || []));

    return [
      {
        title: "🔥 Trending Asian Hits",
        subtitle: "Most popular Korean, Chinese & Asian series streaming today",
        dramas: row1Dramas.length >= 10 ? row1Dramas : fallbackDramas
      },
      {
        title: "💖 Romance & Melodrama",
        subtitle: "Passionate love stories and heartfelt emotional journeys across Asia",
        dramas: row2Dramas.length >= 10 ? row2Dramas : fallbackDramas
      },
      {
        title: "⚔️ Action & Martial Arts",
        subtitle: "High-octane blockbusters, crime thrillers, and epic adventures",
        dramas: row3Dramas.length >= 10 ? row3Dramas : fallbackDramas
      },
      {
        title: "🌸 Top Japanese Anime",
        subtitle: "Top-rated animated series, fantasy realms, and legendary quests",
        dramas: row4Dramas.length >= 10 ? row4Dramas : fallbackDramas
      },
      {
        title: "🎬 Asian Blockbuster Movies",
        subtitle: "Cinematic masterpieces, award-winning films, and box office hits",
        dramas: row5Dramas.length >= 10 ? row5Dramas : fallbackDramas
      }
    ];
  } catch (err) {
    console.warn('fetchAllGenreRows error:', err);
    const koRes = await tmdbFetch(`/discover/tv?with_original_language=ko&sort_by=popularity.desc`);
    const parsed = await parseResults(koRes?.results || []);
    return [
      { title: "🔥 Trending Asian Hits", subtitle: "Most popular series streaming today", dramas: parsed },
      { title: "💖 Romance & Melodrama", subtitle: "Passionate love stories", dramas: parsed },
      { title: "⚔️ Action & Martial Arts", subtitle: "High-octane blockbusters", dramas: parsed },
      { title: "🌸 Top Japanese Anime", subtitle: "Top-rated animated series", dramas: parsed },
      { title: "🎬 Asian Blockbuster Movies", subtitle: "Cinematic masterpieces", dramas: parsed }
    ];
  }
}
