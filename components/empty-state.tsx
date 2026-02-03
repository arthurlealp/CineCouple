"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Film, Search, Dices, Library, Plus, Compass } from "lucide-react";

type EmptyStateVariant = "no-movies" | "no-results" | "no-favorites" | "empty-randomizer" | "generic";

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

const variants: Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string; actionLabel?: string; actionHref?: string }> = {
    "no-movies": {
        icon: <Film className="w-16 h-16" />,
        title: "Sua lista está vazia!",
        description: "Comece a adicionar filmes e séries para acompanhar o que vocês querem assistir juntos.",
        actionLabel: "Explorar Catálogo",
        actionHref: "/discover",
    },
    "no-results": {
        icon: <Search className="w-16 h-16" />,
        title: "Nenhum resultado encontrado",
        description: "Tente buscar com outros termos ou ajustar os filtros.",
    },
    "no-favorites": {
        icon: <Library className="w-16 h-16" />,
        title: "Nenhum favorito ainda",
        description: "Marque filmes como favoritos para vê-los aqui.",
    },
    "empty-randomizer": {
        icon: <Dices className="w-16 h-16" />,
        title: "Nenhum título disponível",
        description: "Adicione filmes ou séries à sua lista para usar o randomizer!",
        actionLabel: "Adicionar Títulos",
        actionHref: "/discover",
    },
    "generic": {
        icon: <Film className="w-16 h-16" />,
        title: "Nada por aqui",
        description: "Parece que não há nada para mostrar ainda.",
    },
};

export function EmptyState({
    variant = "generic",
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    const config = variants[variant];
    const displayIcon = icon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;
    const displayActionLabel = actionLabel || config.actionLabel;
    const displayActionHref = actionHref || config.actionHref;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500">
            {/* Icon with glow effect */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
                <div className="relative p-6 rounded-full bg-muted/50 text-muted-foreground">
                    {displayIcon}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-2">{displayTitle}</h3>

            {/* Description */}
            <p className="text-muted-foreground max-w-md mb-6">{displayDescription}</p>

            {/* Action Button */}
            {(displayActionLabel && displayActionHref) && (
                <Button variant="gradient" className="gap-2" asChild>
                    <Link href={displayActionHref}>
                        {variant === "no-movies" || variant === "empty-randomizer" ? (
                            <Compass className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        {displayActionLabel}
                    </Link>
                </Button>
            )}

            {/* Custom action */}
            {onAction && displayActionLabel && !displayActionHref && (
                <Button variant="gradient" className="gap-2" onClick={onAction}>
                    {displayActionLabel}
                </Button>
            )}
        </div>
    );
}
