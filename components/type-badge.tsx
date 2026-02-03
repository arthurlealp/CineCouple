import { cn } from "@/lib/utils";
import type { ContentType } from "@/lib/types";
import { Film, Tv, Layers } from "lucide-react";

interface TypeBadgeProps {
    type: ContentType;
    size?: "sm" | "md";
    showLabel?: boolean;
    className?: string;
}

const typeConfig: Record<
    ContentType,
    { label: string; icon: typeof Film }
> = {
    movie: {
        label: "Filme",
        icon: Film,
    },
    series: {
        label: "Série",
        icon: Tv,
    },
};

const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
};

const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
};

export function TypeBadge({
    type,
    size = "md",
    showLabel = true,
    className,
}: TypeBadgeProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center text-muted-foreground",
                sizeClasses[size],
                className
            )}
        >
            <Icon className={iconSizes[size]} />
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}
