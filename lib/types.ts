// ============================================
// TIPOS PRINCIPAIS DO CINECOUPLE
// ============================================

// Plataformas de streaming suportadas
export type Platform = "netflix" | "disney" | "hbo";

// Tipos de conteúdo
export type ContentType = "movie" | "series";

// Status de visualização
export type WatchStatus = "watchlist" | "watched" | "abandoned";

// ============================================
// ENTIDADE PRINCIPAL: MOVIE
// ============================================

export interface Movie {
    id: string;
    title: string;
    platform: Platform;
    type: ContentType;
    status: WatchStatus;
    rating: number | null; // 1-5, null se não assistido
    added_at: string; // ISO timestamp
    watched_at: string | null; // ISO timestamp
    user_id: string;
    // TMDB enrichment fields
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string | null;
    tmdb_id: number | null;
    tmdb_rating: number | null; // 0-10 from TMDB
    release_year: number | null;
    genres: string[] | null;
    runtime: number | null; // Duration in minutes
    enriched_at: string | null;
}

// Para criar novo filme (sem id, timestamps automáticos)
export interface CreateMovieInput {
    title: string;
    platform: Platform;
    type: ContentType;
    status?: WatchStatus;
    rating?: number | null;
}

// Para atualizar filme existente
export interface UpdateMovieInput {
    title?: string;
    platform?: Platform;
    type?: ContentType;
    status?: WatchStatus;
    rating?: number | null;
    watched_at?: string | null;
}

// ============================================
// FILTROS E QUERIES
// ============================================

export interface MovieFilters {
    platform?: Platform | "all";
    type?: ContentType | "all";
    status?: WatchStatus | "all";
    search?: string;
}

// ============================================
// ESTATÍSTICAS
// ============================================

export interface MovieStats {
    total: number;
    watched: number;
    watchlist: number;
    abandoned: number;
    byPlatform: {
        netflix: number;
        disney: number;
        hbo: number;
    };
    averageRating: number | null;
}

// ============================================
// AUTH
// ============================================

export interface User {
    id: string;
    email: string;
    created_at: string;
}

// ============================================
// CONSTANTES E HELPERS
// ============================================

export const PLATFORMS: { value: Platform; label: string; color: string }[] = [
    { value: "netflix", label: "Netflix", color: "#E50914" },
    { value: "disney", label: "Disney+", color: "#0063E5" },
    { value: "hbo", label: "HBO Max", color: "#7B2CBF" },
];

export const CONTENT_TYPES: { value: ContentType; label: string }[] = [
    { value: "movie", label: "Filme" },
    { value: "series", label: "Série" },
];

export const WATCH_STATUSES: { value: WatchStatus; label: string; emoji: string }[] = [
    { value: "watchlist", label: "Para Assistir", emoji: "📋" },
    { value: "watched", label: "Assistido", emoji: "✅" },
    { value: "abandoned", label: "Abandonado", emoji: "❌" },
];
