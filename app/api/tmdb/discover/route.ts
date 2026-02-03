import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getTrending, getPopularMovies, getPopularTV, searchContent } from "@/lib/tmdb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as 'movie' | 'tv' | 'all' | null;
    const category = searchParams.get("category") || 'trending';
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || '1');

    try {
        let results;

        // If there's a search query, search for it
        if (query) {
            results = await searchContent(query, type === 'tv' ? 'series' : type === 'movie' ? 'movie' : 'all');
            return NextResponse.json({
                results: results.slice(0, 20).map(r => ({
                    tmdb_id: r.id,
                    title: r.title || r.name,
                    overview: r.overview,
                    poster_path: r.poster_path,
                    backdrop_path: r.backdrop_path,
                    rating: r.vote_average,
                    release_year: r.release_date ? new Date(r.release_date).getFullYear() :
                        r.first_air_date ? new Date(r.first_air_date).getFullYear() : null,
                    media_type: r.media_type || (r.first_air_date ? 'tv' : 'movie')
                }))
            });
        }

        // Get trending or popular based on category
        if (category === 'trending') {
            results = await getTrending(type || 'all', 'week');
        } else if (type === 'tv') {
            results = await getPopularTV(page);
        } else {
            results = await getPopularMovies(page);
        }

        return NextResponse.json({
            results: results.map(r => ({
                tmdb_id: r.id,
                title: r.title || r.name,
                overview: r.overview,
                poster_path: r.poster_path,
                backdrop_path: r.backdrop_path,
                rating: r.vote_average,
                release_year: r.release_date ? new Date(r.release_date).getFullYear() :
                    r.first_air_date ? new Date(r.first_air_date).getFullYear() : null,
                media_type: r.media_type || (r.first_air_date ? 'tv' : 'movie')
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
