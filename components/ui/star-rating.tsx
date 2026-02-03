"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    value: number | null;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

export function StarRating({
    value,
    onChange,
    readonly = false,
    size = "md",
    className,
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const displayValue = hoverValue ?? value ?? 0;

    const handleClick = (rating: number) => {
        if (!readonly && onChange) {
            // Se clicar no mesmo valor, remove a avaliação
            onChange(rating === value ? 0 : rating);
        }
    };

    return (
        <div
            className={cn("flex gap-0.5", className)}
            onMouseLeave={() => setHoverValue(null)}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverValue(star)}
                    disabled={readonly}
                    className={cn(
                        "transition-transform focus:outline-none",
                        !readonly && "hover:scale-110 cursor-pointer",
                        readonly && "cursor-default"
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            "transition-colors",
                            star <= displayValue
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-transparent text-muted-foreground"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
