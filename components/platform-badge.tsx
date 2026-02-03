import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";

interface PlatformBadgeProps {
    platform: Platform;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}

const platformConfig: Record<
    Platform,
    { label: string; abbrev: string; bgClass: string; textClass: string }
> = {
    netflix: {
        label: "Netflix",
        abbrev: "N",
        bgClass: "bg-netflix/20",
        textClass: "text-netflix",
    },
    disney: {
        label: "Disney+",
        abbrev: "D+",
        bgClass: "bg-disney/20",
        textClass: "text-disney",
    },
    hbo: {
        label: "HBO Max",
        abbrev: "HBO",
        bgClass: "bg-hbo/20",
        textClass: "text-hbo",
    },
};

const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
};

export function PlatformBadge({
    platform,
    size = "md",
    showLabel = false,
    className,
}: PlatformBadgeProps) {
    const config = platformConfig[platform];

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-md font-semibold border border-current/30",
                config.bgClass,
                config.textClass,
                sizeClasses[size],
                className
            )}
        >
            {showLabel ? config.label : config.abbrev}
        </span>
    );
}
