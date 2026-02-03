import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";

/**
 * Add a movie/series from TMDB to the user's watchlist
 * POST /api/movies/add-from-tmdb
 * Body: { tmdb_id, media_type, platform }
 */
export async function POST(request: Request) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tmdb_id, media_type, platform = 'netflix' } = body;

        if (!tmdb_id || !media_type) {
            return NextResponse.json(
                { error: "tmdb_id and media_type are required" },
                { status: 400 }
            );
        }

        // Get full details from TMDB
        const details = media_type === 'tv'
            ? await getTVDetails(tmdb_id)
            : await getMovieDetails(tmdb_id);

        // Check if already exists
        const { data: existing } = await supabase
            .from('movies')
            .select('id')
            .eq('user_id', user.id)
            .eq('tmdb_id', tmdb_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: "Este título já está na sua lista", exists: true },
                { status: 400 }
            );
        }

        // Create new movie entry with TMDB data
        const { data: movie, error } = await supabase
            .from('movies')
            .insert({
                user_id: user.id,
                title: details.title || details.name,
                type: media_type === 'tv' ? 'series' : 'movie',
                platform: platform,
                status: 'watchlist',
                rating: null,
                tmdb_id: details.id,
                poster_path: details.poster_path,
                backdrop_path: details.backdrop_path,
                overview: details.overview,
                tmdb_rating: details.vote_average,
                release_year: details.release_date
                    ? new Date(details.release_date).getFullYear()
                    : details.first_air_date
                        ? new Date(details.first_air_date).getFullYear()
                        : null,
                genres: details.genres?.map(g => g.name) || [],
                enriched_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            movie: movie
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
