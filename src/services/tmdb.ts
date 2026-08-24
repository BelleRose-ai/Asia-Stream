import { Drama, CategoryType, Episode } from '../types';

// ==========================================
// PASTE YOUR TMDB API KEY HERE
// ==========================================
export const TMDB_API_KEY = "10eff5fb3987e79f2ed85855a807ea05";

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

  // Fallback to proxy if direct fetch fails or no key
  try {
    const res = await fetch(`/api/tmdb${endpoint}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Proxy TMDB fetch error:', err);
  }

  return null;
}

export async function fetchTmdbMetadata(drama: Drama): Promise<Drama> {
  if (!drama.tmdbId) {
    return drama;
  }

  try {
    const data = await tmdbFetch(`/tv/${drama.tmdbId}?language=en-US`);
    if (!data) return drama;

    return {
      ...drama,
      title: data.name || data.title || drama.title,
      synopsis: data.overview || drama.synopsis,
      rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : drama.rating,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : drama.posterUrl,
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : drama.backdropUrl,
      genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : drama.genres,
      year: data.first_air_date ? new Date(data.first_air_date).getFullYear() : drama.year,
      episodesCount: data.number_of_episodes || drama.episodesCount
    };
  } catch (err) {
    console.warn('TMDB fetch failed:', err);
    return drama;
  }
}

export async function searchTmdbLive(query: string): Promise<Drama[]> {
  if (!query.trim()) return [];

  try {
    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`);
    if (!data || !data.results) return [];

    const results = parseResults(data.results);
    // Prioritize Asian titles (ko, zh, ja)
    return results.sort((a, b) => {
      const isAsianA = ['Korean', 'Mandarin', 'Japanese'].includes(a.language);
      const isAsianB = ['Korean', 'Mandarin', 'Japanese'].includes(b.language);
      if (isAsianA && !isAsianB) return -1;
      if (!isAsianA && isAsianB) return 1;
      return 0;
    });
  } catch (err) {
    console.error('TMDB live search error:', err);
    return [];
  }
}

function parseResults(results: any[]): Drama[] {
  return results
    .filter((item: any) => item.media_type === 'tv' || item.media_type === 'movie')
    .map((item: any): Drama => {
      const isMovie = item.media_type === 'movie';
      const title = item.name || item.title || 'Untitled';
      const origLang = item.original_language;
      
      let category: 'K-Drama' | 'C-Drama' | 'Anime' = 'K-Drama';
      if (origLang === 'zh') category = 'C-Drama';
      else if (origLang === 'ja') category = 'Anime';
      else if (origLang === 'ko') category = 'K-Drama';
      else category = 'K-Drama';

      const episodesCount = isMovie ? 1 : (item.number_of_episodes || 16);
      const generatedEpisodes: Episode[] = Array.from({ length: Math.min(episodesCount, 16) }, (_, i) => ({
        epNum: i + 1,
        quality: i % 2 === 0 ? '1080p FHD' : '720p HD',
        downloadUrl: `https://streamwish.to/tmdb-${item.id}-ep${i + 1}`,
        title: `Episode ${i + 1} (${category} Subbed)`,
        duration: isMovie ? '2h 10m' : '1h 05m'
      }));

      return {
        id: `tmdb-${item.id}`,
        tmdbId: item.id,
        title,
        originalTitle: item.original_name || item.original_title,
        category,
        isTrending: (item.vote_average || 0) >= 7.5,
        year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : (item.release_date ? new Date(item.release_date).getFullYear() : 2024),
        episodesCount,
        status: 'Completed',
        language: origLang === 'ko' ? 'Korean' : origLang === 'zh' ? 'Mandarin' : origLang === 'ja' ? 'Japanese' : 'English',
        country: origLang === 'ko' ? 'South Korea' : origLang === 'zh' ? 'China' : origLang === 'ja' ? 'Japan' : 'International',
        rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.0,
        genres: ['Drama', category],
        synopsis: item.overview || 'No synopsis available from TMDB.',
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        cast: ['Popular Star', 'Lead Actor / Actress'],
        episodes: generatedEpisodes,
        views: `${(Math.random() * 5 + 1).toFixed(1)}M`
      };
    });
}

export async function discoverTmdbCategory(category: CategoryType): Promise<Drama[]> {
  if (category === 'Trending') {
    try {
      const data = await tmdbFetch('/trending/tv/week');
      if (!data || !data.results) return [];
      // Filter trending strictly to Asian languages (ko, zh, ja)
      const asianTrending = data.results.filter((item: any) => 
        item.original_language === 'ko' || 
        item.original_language === 'zh' || 
        item.original_language === 'ja'
      );
      return asianTrending.map((item: any): Drama => {
        const title = item.name || item.title || 'Untitled';
        const origLang = item.original_language;
        let cat: 'K-Drama' | 'C-Drama' | 'Anime' = origLang === 'zh' ? 'C-Drama' : origLang === 'ja' ? 'Anime' : 'K-Drama';
        const episodesCount = item.number_of_episodes || 16;
        const generatedEpisodes: Episode[] = Array.from({ length: Math.min(episodesCount, 16) }, (_, i) => ({
          epNum: i + 1,
          quality: '1080p FHD',
          downloadUrl: `https://streamwish.to/trend-${item.id}-ep${i + 1}`,
          title: `Episode ${i + 1}`,
          duration: '1h 05m'
        }));

        return {
          id: `tmdb-trend-${item.id}`,
          tmdbId: item.id,
          title,
          originalTitle: item.original_name,
          category: cat,
          isTrending: true,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 2024,
          episodesCount,
          status: 'Completed',
          language: origLang === 'ko' ? 'Korean' : origLang === 'zh' ? 'Mandarin' : 'Japanese',
          country: origLang === 'ko' ? 'South Korea' : origLang === 'zh' ? 'China' : 'Japan',
          rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5,
          genres: ['Trending', cat],
          synopsis: item.overview || 'Trending Asian show on TMDB.',
          posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
          backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
          cast: ['Lead Actor', 'Co-Star'],
          episodes: generatedEpisodes,
          views: '4.2M'
        };
      });
    } catch {
      return [];
    }
  }

  if (category === 'All') {
    try {
      // Fetch K-Dramas, C-Dramas, and Anime in parallel and combine them
      const [koRes, zhRes, jaRes] = await Promise.all([
        tmdbFetch('/discover/tv?with_original_language=ko&sort_by=popularity.desc&page=1'),
        tmdbFetch('/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=1'),
        tmdbFetch('/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=1')
      ]);

      const allItems = [
        ...(koRes?.results || []),
        ...(zhRes?.results || []),
        ...(jaRes?.results || [])
      ];

      return parseResults(allItems);
    } catch {
      return [];
    }
  }

  // Specific category
  let endpoint = '/discover/tv?with_original_language=ko&sort_by=popularity.desc&page=1';
  let catName: 'K-Drama' | 'C-Drama' | 'Anime' = 'K-Drama';

  if (category === 'C-Drama') {
    endpoint = '/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=1';
    catName = 'C-Drama';
  } else if (category === 'Anime') {
    endpoint = '/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=1';
    catName = 'Anime';
  }

  try {
    const data = await tmdbFetch(endpoint);
    if (!data || !data.results) return [];
    return data.results.map((item: any): Drama => {
      const title = item.name || 'Untitled';
      const episodesCount = item.number_of_episodes || 16;
      const generatedEpisodes: Episode[] = Array.from({ length: Math.min(episodesCount, 16) }, (_, i) => ({
        epNum: i + 1,
        quality: '1080p FHD',
        downloadUrl: `https://streamwish.to/disc-${item.id}-ep${i + 1}`,
        title: `Episode ${i + 1}`,
        duration: '1h 05m'
      }));

      return {
        id: `tmdb-disc-${item.id}`,
        tmdbId: item.id,
        title,
        originalTitle: item.original_name,
        category: catName,
        isTrending: true,
        year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 2024,
        episodesCount,
        status: 'Completed',
        language: catName === 'K-Drama' ? 'Korean' : catName === 'C-Drama' ? 'Mandarin' : 'Japanese',
        country: catName === 'K-Drama' ? 'South Korea' : catName === 'C-Drama' ? 'China' : 'Japan',
        rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.3,
        genres: [catName],
        synopsis: item.overview || 'Discovered via TMDB.',
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        cast: ['Actor A', 'Actor B'],
        episodes: generatedEpisodes,
        views: '2.1M'
      };
    });
  } catch {
    return [];
  }
}


