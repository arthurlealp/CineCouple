"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListPlus, CheckCircle, Television, FilmStrip } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";    
import { HeroSection } from "@/components/hero-section";
import { MovieCarousel } from "@/components/movie-carousel";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Movie } from "@/lib/types";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

    // Arrays para display (limitados)
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
    const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
    const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);

    // Contagens reais (Totais)
    const [stats, setStats] = useState({
        watchlist: 0,
        watched: 0,
        series: 0,
        movies: 0
    });

    const supabase = createClient();

    useEffect(() => {
        async function loadData() {
            const { data: allMovies } = await supabase.from("movies").select("*");

            if (allMovies && allMovies.length > 0) {
                const movies = allMovies as Movie[];

                // Calcular Totais
                setStats({
                    watchlist: movies.filter(m => m.status === 'watchlist').length,
                    watched: movies.filter(m => m.status === 'watched').length,
                    series: movies.filter(m => m.type === 'series').length,
                    movies: movies.filter(m => m.type === 'movie').length
                });

                // Watchlist (Para Assistir)
                const watchlist = movies.filter(m => m.status === 'watchlist');
                setWatchlistMovies(watchlist); // Watchlist pode ser longa, o carrossel lida com scroll

                // Assistidos
                const watched = movies.filter(m => m.status === 'watched')
                    .sort((a, b) => new Date(b.watched_at || b.added_at).getTime() - new Date(a.watched_at || a.added_at).getTime());
                setWatchedMovies(watched.slice(0, 15));

                // Recentes (ordenar por added_at)
                const recent = [...movies].sort((a, b) =>
                    new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
                ).slice(0, 15);
                setRecentMovies(recent);

                // Séries
                const series = movies.filter(m => m.type === 'series');
                setSeriesMovies(series.slice(0, 15));

                // Featured: Pegar um da watchlist com backdrop, se não tiver, qualquer um
                const withBackdrop = watchlist.filter(m => m.backdrop_path);
                const pool = withBackdrop.length > 0 ? withBackdrop : watchlist.length > 0 ? watchlist : movies;
                setFeaturedMovie(pool[Math.floor(Math.random() * pool.length)]);
            }

            setLoading(false);
        }

        loadData();
    }, [supabase]);

    if (loading) return <DashboardSkeleton />;

    // Empty state quando não tem nada
    if (!featuredMovie && watchlistMovies.length === 0 && recentMovies.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <EmptyState
                    variant="no-movies"
                    title="Bem-vindos ao CineCouple! 🎬"
                    description="Sua jornada cinematográfica começa aqui. Adicione filmes e séries para acompanhar o que vocês querem assistir juntos."
                    actionLabel="Explorar Catálogo"
                    actionHref="/discover"
                />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Hero Section */}
            {featuredMovie && (
                <HeroSection movie={featuredMovie} />
            )}

            {/* Para Assistir */}
            {watchlistMovies.length > 0 && (
                <MovieCarousel
                    title="🍿 Para Assistir"
                    movies={watchlistMovies}
                    emptyMessage="Nenhum título na lista"
                />
            )}

            {/* Continue Assistindo (Assistidos recentemente) */}
            {watchedMovies.length > 0 && (
                <MovieCarousel
                    title="✅ Assistidos Recentemente"
                    movies={watchedMovies}
                    showProgress={false}
                />
            )}

            {/* Adicionados Recentemente */}
            {recentMovies.length > 0 && (
                <MovieCarousel
                    title="🆕 Adicionados Recentemente"
                    movies={recentMovies}
                />
            )}

            {/* Séries */}
            {seriesMovies.length > 0 && (
                <MovieCarousel
                    title="📺 Séries"
                    movies={seriesMovies}
                    emptyMessage="Nenhuma série adicionada"
                />
            )}

            {/* Stats Section */}
            <section className="px-4 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-2 group hover:bg-white/5 transition-colors">
                        <ListPlus weight="duotone" className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-bold text-white">
                            {watchlistMovies.length > 0 &&
                                (watchlistMovies.length === 15 ? "15+" : watchlistMovies.length)
                            }
                            {stats.watchlist > 15 ? stats.watchlist : null}
                            {/* Ajuste: na verdade stats.watchlist tem o valor total correto, então vamos usar ele sempre */}
                        </div>
                        {/* Corrigindo display do count - vou reescrever essa lógica no write_to_file para ser mais limpa */}
                    </div>
                </div>
            </section>
        </div>
    );
}
