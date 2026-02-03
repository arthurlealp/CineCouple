"use client";

import { useEffect, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { MovieCard } from "@/components/movie-card";
import { MovieGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/lib/supabase/client";
import type { Movie, MovieFilters } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce"; // Vamos criar esse hook rapidinho

export default function CatalogPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<MovieFilters>({
        platform: "all",
        type: "all",
        status: "all",
        search: "",
    });

    const supabase = createClient();
    const debouncedSearch = useDebounce(filters.search, 500);

    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            let query = supabase.from("movies").select("*");

            if (filters.platform && filters.platform !== "all") {
                query = query.eq("platform", filters.platform);
            }

            if (filters.type && filters.type !== "all") {
                query = query.eq("type", filters.type);
            }

            if (filters.status && filters.status !== "all") {
                query = query.eq("status", filters.status);
            }

            if (debouncedSearch) {
                query = query.ilike("title", `%${debouncedSearch}%`);
            }

            const { data } = await query.order("added_at", { ascending: false });

            if (data) setMovies(data as Movie[]);
            setLoading(false);
        }

        fetchMovies();
    }, [filters.platform, filters.type, filters.status, debouncedSearch, supabase]);

    const handleFiltersChange = (newFilters: MovieFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6 animate-in">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Catálogo Completo</h1>
                <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />
            </div>

            {loading ? (
                <MovieGridSkeleton count={10} />
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>

                    {movies.length === 0 && (
                        <EmptyState
                            variant="no-results"
                            title="Nenhum título encontrado 😢"
                            description="Tente ajustar os filtros ou explore o catálogo do TMDB para adicionar novos títulos."
                            actionLabel="Explorar Catálogo"
                            actionHref="/discover"
                        />
                    )}
                </>
            )}
        </div>
    );
}
