import { Drama, CategoryType, Episode } from '../types';

export async function fetchTmdbMetadata(drama: Drama, apiKey?: string): Promise<Drama> {
  if (!apiKey || !drama.tmdbId) {
    return drama;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${drama.tmdbId}?api_key=${apiKey}&language=en-US`);
    if (!res.ok) return drama;

    const data = await res.json();
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
    console.warn('TMDB fetch failed, using fallback database details:', err);
    return drama;
  }
}

export async function searchTmdbLive(query: string, apiKey: string): Promise<Drama[]> {
  if (!apiKey || !query.trim()) return [];

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`);
    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results || [];

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
  } catch (err) {
    console.error('TMDB live search error:', err);
    return [];
  }
}

export async function discoverTmdbCategory(category: CategoryType, apiKey: string): Promise<Drama[]> {
  if (!apiKey) return [];

  let langParam = 'ko';
  if (category === 'C-Drama') langParam = 'zh';
  if (category === 'Anime') langParam = 'ja';
  if (category === 'Trending') {
    // fetch trending tv
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).map((item: any): Drama => {
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
          synopsis: item.overview || 'Trending show on TMDB.',
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

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_original_language=${langParam}&sort_by=popularity.desc&page=1`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((item: any): Drama => {
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
        category: category === 'C-Drama' ? 'C-Drama' : category === 'Anime' ? 'Anime' : 'K-Drama',
        isTrending: true,
        year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 2024,
        episodesCount,
        status: 'Completed',
        language: langParam === 'ko' ? 'Korean' : langParam === 'zh' ? 'Mandarin' : 'Japanese',
        country: langParam === 'ko' ? 'South Korea' : langParam === 'zh' ? 'China' : 'Japan',
        rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.3,
        genres: [category],
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
