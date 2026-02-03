import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { searchContent } from "@/lib/tmdb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") as 'movie' | 'series' | 'all' | null;

    if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    try {
        const results = await searchContent(query, type || 'all');

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
                // Set media_type: use TMDB's if available, otherwise infer from search type
                media_type: r.media_type || (type === 'series' ? 'tv' : 'movie')
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
