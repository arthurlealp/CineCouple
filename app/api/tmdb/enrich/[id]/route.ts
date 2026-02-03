import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";

/**
 * Enrich a specific movie with TMDB data by TMDB ID
 * POST /api/tmdb/enrich/[id]
 * Body: { tmdb_id: number, media_type: 'movie' | 'tv' }
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = createClient();

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tmdb_id, media_type } = body;

        if (!tmdb_id || !media_type) {
            return NextResponse.json(
                { error: "tmdb_id and media_type are required" },
                { status: 400 }
            );
        }

        // Get movie from database
        const { data: movie, error: fetchError } = await supabase
            .from('movies')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !movie) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 });
        }

        // Get full details from TMDB
        const details = media_type === 'tv'
            ? await getTVDetails(tmdb_id)
            : await getMovieDetails(tmdb_id);

        // Update database
        const { error: updateError } = await supabase
            .from('movies')
            .update({
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
            .eq('id', id);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            movie: {
                id: id,
                title: movie.title,
                tmdb_id: details.id,
                poster_path: details.poster_path
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
