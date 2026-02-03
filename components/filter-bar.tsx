"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "./ui/input";
import { Select, type SelectOption } from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { MovieFilters, Platform, ContentType, WatchStatus } from "@/lib/types";
import { PLATFORMS, CONTENT_TYPES, WATCH_STATUSES } from "@/lib/types";

interface FilterBarProps {
    filters: MovieFilters;
    onFiltersChange: (filters: MovieFilters) => void;
    className?: string;
}

const platformOptions: SelectOption[] = [
    { value: "all", label: "Todas Plataformas" },
    ...PLATFORMS.map((p) => ({ value: p.value, label: p.label })),
];

const typeOptions: SelectOption[] = [
    { value: "all", label: "Todos os Tipos" },
    ...CONTENT_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

const statusOptions: SelectOption[] = [
    { value: "all", label: "Todos os Status" },
    ...WATCH_STATUSES.map((s) => ({ value: s.value, label: `${s.emoji} ${s.label}` })),
];

export function FilterBar({ filters, onFiltersChange, className }: FilterBarProps) {
    const hasActiveFilters =
        filters.search ||
        (filters.platform && filters.platform !== "all") ||
        (filters.type && filters.type !== "all") ||
        (filters.status && filters.status !== "all");

    const clearFilters = () => {
        onFiltersChange({
            search: "",
            platform: "all",
            type: "all",
            status: "all",
        });
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar filmes e séries..."
                    value={filters.search || ""}
                    onChange={(e) =>
                        onFiltersChange({ ...filters, search: e.target.value })
                    }
                    className="pl-10"
                />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
                <Select
                    options={platformOptions}
                    value={filters.platform || "all"}
                    onChange={(value) =>
                        onFiltersChange({
                            ...filters,
                            platform: value as Platform | "all",
                        })
                    }
                    className="w-[180px]"
                />

                <Select
                    options={typeOptions}
                    value={filters.type || "all"}
                    onChange={(value) =>
                        onFiltersChange({
                            ...filters,
                            type: value as ContentType | "all",
                        })
                    }
                    className="w-[160px]"
                />

                <Select
                    options={statusOptions}
                    value={filters.status || "all"}
                    onChange={(value) =>
                        onFiltersChange({
                            ...filters,
                            status: value as WatchStatus | "all",
                        })
                    }
                    className="w-[180px]"
                />

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-1"
                    >
                        <X className="w-4 h-4" />
                        Limpar Filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
