/**
 * Video Streaming & Download Services (10 Alternative Embed Servers)
 */

export interface StreamServer {
  name: string;
  getMovieUrl: (id: string | number) => string;
  getTvUrl: (id: string | number, season: number, episode: number) => string;
}

export const STREAM_SERVERS: StreamServer[] = [
  { 
    name: "Server 1 (AutoEmbed)", 
    getMovieUrl: (id) => `https://autoembed.co/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://autoembed.co/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 2 (VidSrc.to)", 
    getMovieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 3 (VidSrc.vip)", 
    getMovieUrl: (id) => `https://vidsrc.vip/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.vip/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 4 (MultiEmbed)", 
    getMovieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, 
    getTvUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` 
  },
  { 
    name: "Server 5 (VidLink)", 
    getMovieUrl: (id) => `https://vidlink.pro/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 6 (Embed.su)", 
    getMovieUrl: (id) => `https://embed.su/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 7 (VidSrc.cc)", 
    getMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 8 (2Embed)", 
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`, 
    getTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` 
  },
  { 
    name: "Server 9 (SuperEmbed)", 
    getMovieUrl: (id) => `https://iframe.superembed.stream/movie/?tmdb=${id}`, 
    getTvUrl: (id, s, e) => `https://iframe.superembed.stream/tv/?tmdb=${id}&season=${s}&episode=${e}` 
  },
  { 
    name: "Server 10 (Vidsrc.icu)", 
    getMovieUrl: (id) => `https://vidsrc.icu/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.icu/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 11 (VidSrc.me Alternate)", 
    getMovieUrl: (id) => `https://vidsrc.me/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}` 
  },
  { 
    name: "Server 12 (VidSrc.net Alternate)", 
    getMovieUrl: (id) => `https://vidsrc.net/embed/movie/${id}`, 
    getTvUrl: (id, s, e) => `https://vidsrc.net/embed/tv/${id}/${s}/${e}` 
  },
];
