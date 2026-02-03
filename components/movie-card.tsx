"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Movie } from "@/lib/types";
import { PlatformBadge } from "./platform-badge";
import { TypeBadge } from "./type-badge";
import { StarRating } from "./ui/star-rating";
import { Check, Clock, X } from "lucide-react";

interface MovieCardProps {
    movie: Movie;
    className?: string;
}

const statusConfig = {
    watchlist: {
        icon: Clock,
        label: "Para Assistir",
        className: "text-blue-400",
    },
    watched: {
        icon: Check,
        label: "Assistido",
        className: "text-green-400",
    },
    abandoned: {
        icon: X,
        label: "Abandonado",
        className: "text-red-400",
    },
};

export function MovieCard({ movie, className }: MovieCardProps) {
    const statusInfo = statusConfig[movie.status];
    const StatusIcon = statusInfo.icon;

    return (
        <Link
            href={`/movie/${movie.id}`}
            className={cn(
                "group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
                className
            )}
        >
            {/* Cover - TMDB Poster or Placeholder */}
            <div className="relative aspect-[2/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {movie.poster_path ? (
                    <>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-muted-foreground/30">
                            {movie.title.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Platform Badge - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                    <PlatformBadge platform={movie.platform} size="sm" />
                </div>

                {/* Status Indicator - Top Left */}
                <div
                    className={cn(
                        "absolute top-2 left-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm z-10",
                        statusInfo.className
                    )}
                    title={statusInfo.label}
                >
                    <StatusIcon className="w-4 h-4" />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-[5]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-3">
                {/* Title */}
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {movie.title}
                </h3>

                {/* Meta Row */}
                <div className="flex items-center justify-between">
                    <TypeBadge type={movie.type} size="sm" />

                    {movie.status === "watched" && movie.rating !== null && (
                        <StarRating value={movie.rating} readonly size="sm" />
                    )}
                </div>
            </div>
        </Link>
    );
}
