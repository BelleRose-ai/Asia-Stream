export type CategoryType = 'All' | 'K-Drama' | 'C-Drama' | 'Anime' | 'Trending';

export interface Episode {
  epNum: number;
  quality: string;
  downloadUrl: string;
  title?: string;
  duration?: string;
  overview?: string;
  stillPath?: string;
  airDate?: string;
}

export interface SeasonInfo {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  overview?: string;
  posterPath?: string;
}

export interface Drama {
  id: string;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  category: 'K-Drama' | 'C-Drama' | 'Anime';
  isTrending?: boolean;
  year: number;
  episodesCount: number;
  status: 'Ongoing' | 'Completed';
  language: string;
  country: string;
  rating: number;
  genres: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  cast: string[];
  episodes: Episode[];
  seasons?: SeasonInfo[];
  views?: string;
}

