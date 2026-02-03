import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { findBestMatch, getMovieDetails, getTVDetails } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";
import { z } from "zod";

/**
 * Enrich a single movie or all movies with TMDB data
 * GET /api/tmdb/enrich - Enrich all movies without TMDB data
 * GET /api/tmdb/enrich?id=<movie_id> - Enrich specific movie
 */
export async function GET(request: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id");

    // Validar input (se fornecido)
    if (movieId) {
        const uuidSchema = z.string().uuid();
        const result = uuidSchema.safeParse(movieId);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid Movie ID (must be a valid UUID)" }, { status: 400 });
        }
    }

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let moviesToEnrich: Movie[] = [];

        if (movieId) {
            // Enrich specific movie
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('id', movieId)
                .eq('user_id', user.id)
                .single();

            if (error || !data) {
                return NextResponse.json({ error: "Movie not found" }, { status: 404 });
            }
            moviesToEnrich = [data as Movie];
        } else {
            // Enrich all movies without TMDB data
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', user.id)
                .is('tmdb_id', null);

            if (error) throw error;
            moviesToEnrich = (data || []) as Movie[];
        }

        const enriched: any[] = [];
        const failed: any[] = [];

        for (const movie of moviesToEnrich) {
            try {
                // Use smart matching to find best result
                const bestMatch = await findBestMatch(
                    movie.title,
                    movie.type === 'series' ? 'series' : 'movie'
                );

                if (!bestMatch) {
                    failed.push({ id: movie.id, title: movie.title, reason: "No good match found" });
                    continue;
                }

                // Get full details
                const details = bestMatch.media_type === 'tv'
                    ? await getTVDetails(bestMatch.id)
                    : await getMovieDetails(bestMatch.id);

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
                    .eq('id', movie.id);

                if (updateError) throw updateError;

                enriched.push({
                    id: movie.id,
                    title: movie.title,
                    tmdb_id: details.id,
                    poster_path: details.poster_path
                });

            } catch (error: any) {
                failed.push({ id: movie.id, title: movie.title, reason: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            enriched: enriched.length,
            failed: failed.length,
            details: { enriched, failed }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
