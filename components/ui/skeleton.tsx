import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-muted/50",
                className
            )}
        />
    );
}

// Movie Card Skeleton
export function MovieCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border border-border bg-card">
            {/* Poster */}
            <div className="aspect-[2/3] relative">
                <Skeleton className="w-full h-full rounded-none" />

                {/* Badge placeholders */}
                <div className="absolute top-2 left-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="absolute top-2 right-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    );
}

// Grid of movie card skeletons
export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Discover card skeleton (more horizontal layout)
export function DiscoverCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="aspect-[2/3] relative">
                <Skeleton className="w-full h-full rounded-none" />
            </div>
            <div className="p-2 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function DiscoverGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <DiscoverCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Suggestion/Featured card skeleton
export function SuggestionSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-8 w-2/3" />
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
    );
}

// Stats skeleton
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-24" />
                </div>
            ))}
        </div>
    );
}

// Dashboard full skeleton
export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-36 rounded-xl" />
            </div>

            {/* Suggestion */}
            <SuggestionSkeleton />

            {/* Stats */}
            <StatsSkeleton />

            {/* Recent movies section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <MovieGridSkeleton count={5} />
            </div>
        </div>
    );
}
