"use client";

import Link from "next/link";
import { PlayCircle, Plus, Star, CalendarBlank, Clock, Info, Check } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/platform-badge";
import type { Movie } from "@/lib/types";

interface HeroSectionProps {
    movie: Movie;
    onAddToList?: () => void;
    isInList?: boolean;
}

export function HeroSection({ movie, onAddToList, isInList }: HeroSectionProps) {
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : null;

    return (
        <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] -mt-4 -mx-4 md:-mx-8 lg:-mx-12 mb-8">
            {/* Background Image */}
            {backdropUrl ? (
                <img
                    src={backdropUrl}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-background" />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
                <div className="max-w-3xl space-y-4">
                    {/* Badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <PlatformBadge platform={movie.platform} />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${movie.type === 'series'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                            {movie.type === 'series' ? '📺 Série' : '🎬 Filme'}
                        </span>
                        {movie.status === 'watchlist' && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
                                ✨ Sugestão do Dia
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="font-display uppercase tracking-widest text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                        {movie.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-white/80 flex-wrap">
                        {movie.tmdb_rating && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                                <Star weight="fill" className="w-4 h-4 text-yellow-400" />
                                <span className="font-bold text-yellow-400">{movie.tmdb_rating.toFixed(1)}</span>
                                <span className="text-yellow-400/60">/10</span>
                            </div>
                        )}
                        {movie.release_year && (
                            <div className="flex items-center gap-1.5">
                                <CalendarBlank weight="duotone" className="w-4 h-4" />
                                <span>{movie.release_year}</span>
                            </div>
                        )}
                        {movie.runtime && (
                            <div className="flex items-center gap-1.5">
                                <Clock weight="duotone" className="w-4 h-4" />
                                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                            </div>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {movie.genres.slice(0, 4).map((genre, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Overview */}
                    {movie.overview && (
                        <p className="text-white/70 text-sm md:text-base line-clamp-3 max-w-2xl leading-relaxed">
                            {movie.overview}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            size="lg"
                            className="gap-2 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
                            asChild
                        >
                            <Link href={`/movie/${movie.id}`}>
                                <PlayCircle weight="fill" className="w-6 h-6" />
                                Ver Detalhes
                            </Link>
                        </Button>

                        {onAddToList && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                                onClick={onAddToList}
                            >
                                {isInList ? (
                                    <>
                                        <Check weight="bold" className="w-5 h-5" />
                                        Na Lista
                                    </>
                                ) : (
                                    <>
                                        <Plus weight="bold" className="w-5 h-5" />
                                        Minha Lista
                                    </>
                                )}
                            </Button>
                        )}

                        <Button
                            size="lg"
                            variant="ghost"
                            className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href={`/movie/${movie.id}`}>
                                <Info weight="duotone" className="w-6 h-6" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
