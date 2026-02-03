"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dices, RotateCcw, Play, ChevronLeft, Sparkles, Film, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PlatformBadge } from "@/components/platform-badge";
import { EmptyState } from "@/components/empty-state";
import type { Movie } from "@/lib/types";

export default function RandomizerPage() {
    const router = useRouter();
    const supabase = createClient();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [filterPlatform, setFilterPlatform] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');

    const slotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadMovies();
    }, []);

    useEffect(() => {
        let filtered = movies.filter(m => m.status === 'watchlist');

        if (filterPlatform !== 'all') {
            filtered = filtered.filter(m => m.platform === filterPlatform);
        }
        if (filterType !== 'all') {
            filtered = filtered.filter(m => m.type === filterType);
        }

        setFilteredMovies(filtered);
    }, [movies, filterPlatform, filterType]);

    const loadMovies = async () => {
        const { data } = await supabase
            .from('movies')
            .select('*')
            .eq('status', 'watchlist');

        if (data) {
            setMovies(data as Movie[]);
        }
    };

    const spin = () => {
        if (filteredMovies.length === 0) return;

        setIsSpinning(true);
        setHasResult(false);
        setSelectedMovie(null);

        // Create shuffled display sequence
        const shuffleCount = 20 + Math.floor(Math.random() * 10);
        let currentIndex = 0;
        let delay = 50;

        const shuffle = () => {
            if (currentIndex < shuffleCount) {
                const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
                setSelectedMovie(randomMovie);
                currentIndex++;

                // Slow down towards the end
                if (currentIndex > shuffleCount - 10) {
                    delay += 30;
                }
                if (currentIndex > shuffleCount - 5) {
                    delay += 50;
                }

                setTimeout(shuffle, delay);
            } else {
                // Final selection
                const winner = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
                setSelectedMovie(winner);
                setIsSpinning(false);
                setHasResult(true);
            }
        };

        shuffle();
    };

    const platforms = [
        { id: 'all', label: 'Todas' },
        { id: 'netflix', label: 'Netflix', color: 'bg-red-600' },
        { id: 'disney', label: 'Disney+', color: 'bg-blue-600' },
        { id: 'hbo', label: 'HBO Max', color: 'bg-purple-600' },
    ];

    const types = [
        { id: 'all', label: 'Tudo', icon: Sparkles },
        { id: 'movie', label: 'Filmes', icon: Film },
        { id: 'series', label: 'Séries', icon: Tv },
    ];

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in">
            {/* Header */}
            <div className="absolute top-4 left-4">
                <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Dices className={`w-10 h-10 text-primary ${isSpinning ? 'animate-bounce' : ''}`} />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Randomizer
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    Deixe o destino escolher o próximo filme! 🎲
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                {/* Platform Filter */}
                <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
                    {platforms.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setFilterPlatform(p.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterPlatform === p.id
                                ? 'bg-card shadow-lg text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
                    {types.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilterType(t.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filterType === t.id
                                ? 'bg-card shadow-lg text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <t.icon className="w-4 h-4" />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Counter */}
            <p className="text-sm text-muted-foreground mb-6">
                {filteredMovies.length} título{filteredMovies.length !== 1 ? 's' : ''} na roleta
            </p>

            {/* Slot Machine Display */}
            <div className="relative w-full max-w-md mb-8">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl transition-opacity duration-500 ${isSpinning ? 'opacity-100 animate-pulse' : hasResult ? 'opacity-75' : 'opacity-30'
                    }`} />

                {/* Card Container */}
                <div
                    ref={slotRef}
                    className={`relative aspect-[2/3] max-h-[400px] rounded-2xl border-4 overflow-hidden transition-all duration-300 ${isSpinning
                        ? 'border-primary shadow-2xl shadow-primary/30 scale-105'
                        : hasResult
                            ? 'border-secondary shadow-2xl shadow-secondary/30'
                            : 'border-border bg-card'
                        }`}
                >
                    {selectedMovie ? (
                        <>
                            {/* Poster */}
                            {selectedMovie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                    className={`w-full h-full object-cover transition-transform duration-200 ${isSpinning ? 'blur-sm scale-110' : ''
                                        }`}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                    <span className="text-8xl font-bold text-muted-foreground/30">
                                        {selectedMovie.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Overlay with info */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${isSpinning ? 'opacity-50' : 'opacity-100'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <PlatformBadge platform={selectedMovie.platform} />
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedMovie.type === 'series'
                                        ? 'bg-blue-500/90 text-white'
                                        : 'bg-purple-500/90 text-white'
                                        }`}>
                                        {selectedMovie.type === 'series' ? 'Série' : 'Filme'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white line-clamp-2">
                                    {selectedMovie.title}
                                </h2>
                                {selectedMovie.release_year && (
                                    <p className="text-white/70 text-sm">{selectedMovie.release_year}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                            <Dices className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground">
                                Clique em "Girar" para sortear!
                            </p>
                        </div>
                    )}

                    {/* Spinning overlay effect */}
                    {isSpinning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
                    )}
                </div>

                {/* Winner sparkles */}
                {hasResult && !isSpinning && (
                    <div className="absolute -top-4 -left-4 -right-4 -bottom-4 pointer-events-none">
                        <Sparkles className="absolute top-0 left-1/4 w-6 h-6 text-yellow-400 animate-ping" />
                        <Sparkles className="absolute top-1/4 right-0 w-5 h-5 text-yellow-400 animate-ping animation-delay-100" />
                        <Sparkles className="absolute bottom-1/4 left-0 w-4 h-4 text-yellow-400 animate-ping animation-delay-200" />
                        <Sparkles className="absolute bottom-0 right-1/4 w-6 h-6 text-yellow-400 animate-ping animation-delay-300" />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                {filteredMovies.length > 0 ? (
                    <>
                        <Button
                            size="lg"
                            className={`gap-2 px-8 py-6 text-lg font-bold transition-all ${isSpinning
                                ? 'animate-pulse'
                                : 'hover:scale-105 hover:shadow-xl hover:shadow-primary/20'
                                }`}
                            onClick={spin}
                            disabled={isSpinning}
                        >
                            <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                            {isSpinning ? 'Girando...' : hasResult ? 'Girar Novamente' : 'Girar!'}
                        </Button>

                        {hasResult && selectedMovie && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 px-8 py-6 text-lg hover:scale-105 transition-all"
                                asChild
                            >
                                <Link href={`/movie/${selectedMovie.id}`}>
                                    <Play className="w-5 h-5" />
                                    Ver Detalhes
                                </Link>
                            </Button>
                        )}
                    </>
                ) : (
                    <EmptyState variant="empty-randomizer" />
                )}
            </div>

            {/* Reset filters */}
            {(filterPlatform !== 'all' || filterType !== 'all') && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 gap-2 text-muted-foreground"
                    onClick={() => {
                        setFilterPlatform('all');
                        setFilterType('all');
                    }}
                >
                    <RotateCcw className="w-4 h-4" />
                    Limpar Filtros
                </Button>
            )}
        </div>
    );
}
