const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export interface TMDBSearchResult {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: 'movie' | 'tv';
}

export interface TMDBMovieDetails extends TMDBSearchResult {
    genres: { id: number; name: string }[];
    runtime: number;
}

export interface TMDBTVDetails extends TMDBSearchResult {
    genres: { id: number; name: string }[];
    number_of_seasons: number;
}

/**
 * Search for movies by title
 */
export async function searchMovie(query: string): Promise<TMDBSearchResult[]> {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    const data = await response.json();
    return data.results || [];
}

/**
 * Search for TV series by title
 */
export async function searchTV(query: string): Promise<TMDBSearchResult[]> {
    const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    const data = await response.json();
    return data.results || [];
}

/**
 * Get full movie details by TMDB ID
 */
export async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetails> {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    return await response.json();
}

/**
 * Get full TV series details by TMDB ID
 */
export async function getTVDetails(tmdbId: number): Promise<TMDBTVDetails> {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    return await response.json();
}

/**
 * Build full image URL from TMDB path
 * @param path - Image path from TMDB (e.g., "/abc123.jpg")
 * @param size - Image size: "w92", "w154", "w185", "w342", "w500", "w780", "original"
 */
export function getImageUrl(path: string | null, size: string = 'w500'): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

/**
 * Get trending movies/TV shows
 */
export async function getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResult[]> {
    const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    const data = await response.json();
    return data.results || [];
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBSearchResult[]> {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    const data = await response.json();
    return data.results || [];
}

/**
 * Get popular TV series
 */
export async function getPopularTV(page: number = 1): Promise<TMDBSearchResult[]> {
    const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('TMDB API error');

    const data = await response.json();
    return data.results || [];
}

/**
 * Search for content (movie or TV) by title
 * Returns both movie and TV results
 */
export async function searchContent(query: string, type: 'movie' | 'series' | 'all' = 'all'): Promise<TMDBSearchResult[]> {
    if (type === 'movie') return searchMovie(query);
    if (type === 'series') return searchTV(query);

    // Search both
    const [movieResults, tvResults] = await Promise.all([
        searchMovie(query),
        searchTV(query)
    ]);

    return [
        ...movieResults.map(r => ({ ...r, media_type: 'movie' as const })),
        ...tvResults.map(r => ({ ...r, media_type: 'tv' as const }))
    ].sort((a, b) => b.vote_average - a.vote_average);
}

/**
 * Normalize a title for better matching
 */
export function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/^(saga|trilogia|serie)\s+/i, '') // Remove prefixes
        .replace(/\s*[:–-]\s*.+$/, '') // Remove subtitles
        .replace(/\s+\d+$/, '') // Remove trailing numbers
        .replace(/[^\w\s]/g, '') // Remove special chars
        .trim();
}

/**
 * Calculate similarity between two strings (0-1)
 */
function stringSimilarity(a: string, b: string): number {
    const s1 = normalizeTitle(a);
    const s2 = normalizeTitle(b);

    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;

    // Simple character-based similarity
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (longer.includes(shorter[i])) matches++;
    }

    return matches / longer.length;
}

/**
 * Find the best TMDB match for a title with smart scoring
 */
export async function findBestMatch(
    title: string,
    contentType: 'movie' | 'series'
): Promise<TMDBSearchResult | null> {
    const normalizedTitle = normalizeTitle(title);

    // Try different search strategies
    const searchQueries = [
        title,                    // Original title
        normalizedTitle,          // Normalized title
        title.split(':')[0],      // Before colon (for subtitles)
        title.split(' - ')[0],    // Before dash
    ].filter((q, i, arr) => q && arr.indexOf(q) === i); // Remove duplicates

    let allResults: (TMDBSearchResult & { score: number })[] = [];

    for (const query of searchQueries) {
        try {
            // Search in the right type
            const results = contentType === 'series'
                ? await searchTV(query)
                : await searchMovie(query);

            // Score each result
            for (const result of results) {
                const resultTitle = result.title || result.name || '';
                const titleMatch = stringSimilarity(title, resultTitle);
                const popularity = Math.min(result.vote_average / 10, 1);

                // Combined score: 70% title match, 30% popularity
                const score = (titleMatch * 0.7) + (popularity * 0.3);

                allResults.push({
                    ...result,
                    media_type: contentType === 'series' ? 'tv' : 'movie',
                    score
                });
            }
        } catch (e) {
            continue;
        }
    }

    if (allResults.length === 0) return null;

    // Sort by score and return best match
    allResults.sort((a, b) => b.score - a.score);

    // Only return if score is good enough (> 0.5)
    const best = allResults[0];
    return best.score > 0.5 ? best : null;
}

