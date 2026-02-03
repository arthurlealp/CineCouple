"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CaretLeft, CaretRight, PlayCircle, Star } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/platform-badge";
import type { Movie } from "@/lib/types";

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
    showProgress?: boolean;
    emptyMessage?: string;
}

export function MovieCarousel({ title, movies, showProgress = false, emptyMessage = "Nenhum título" }: MovieCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
        scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    if (movies.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 group/carousel">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-display uppercase tracking-widest text-lg md:text-xl font-bold">{title}</h2>
                <div className="flex gap-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-card/80 hover:bg-card"
                        onClick={() => scroll('left')}
                        disabled={!showLeftArrow}
                    >
                        <CaretLeft weight="bold" className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-card/80 hover:bg-card"
                        onClick={() => scroll('right')}
                        disabled={!showRightArrow}
                    >
                        <CaretRight weight="bold" className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative -mx-4 px-4">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/movie/${movie.id}`}
                            className="flex-shrink-0 w-40 sm:w-48 snap-start group"
                        >
                            {/* Poster */}
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted mb-2 transition-transform group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <span className="text-4xl font-bold text-muted-foreground/30">
                                            {movie.title.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <PlatformBadge platform={movie.platform} size="sm" />
                                        {movie.tmdb_rating && (
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <Star weight="fill" className="w-3 h-3 text-yellow-400" />
                                                <span className="text-xs font-medium">{movie.tmdb_rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Button size="sm" className="w-full gap-2 transition-transform hover:scale-105">
                                        <PlayCircle weight="fill" className="w-4 h-4" />
                                        Ver
                                    </Button>
                                </div>

                                {/* Progress bar (for continue watching) */}
                                {showProgress && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${Math.random() * 60 + 20}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {movie.release_year && <span>{movie.release_year}</span>}
                                <span className="capitalize">{movie.type === 'series' ? 'Série' : 'Filme'}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Gradient edges */}
                {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                )}
                {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                )}
            </div>
        </div>
    );
}
