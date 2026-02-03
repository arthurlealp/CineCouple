"use client";

import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import type { Movie } from "@/lib/types";

interface TMDBSearchResult {
    tmdb_id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    rating: number;
    release_year: number | null;
    media_type: 'movie' | 'tv';
}

interface TMDBEnrichButtonProps {
    movie: Movie;
    onEnriched?: () => void;
}

export function TMDBEnrichButton({ movie, onEnriched }: TMDBEnrichButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const [enriching, setEnriching] = useState(false);
    const [searchQuery, setSearchQuery] = useState(movie.title);
    const [results, setResults] = useState<TMDBSearchResult[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const type = movie.type === 'series' ? 'series' : 'movie';
            const url = `/api/tmdb/search?q=${encodeURIComponent(searchQuery)}&type=${type}`;
            console.log('Searching:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('Search results:', data);
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            alert('Erro ao buscar no TMDB');
        }
        setSearching(false);
    };

    const handleSelectResult = async (result: TMDBSearchResult) => {
        setEnriching(true);

        const payload = {
            tmdb_id: result.tmdb_id,
            media_type: result.media_type
        };

        console.log('=== ENRICH REQUEST ===');
        console.log('Movie ID:', movie.id);
        console.log('URL:', `/api/tmdb/enrich/${movie.id}`);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('Result object:', result);

        try {
            const response = await fetch(`/api/tmdb/enrich/${movie.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                alert('✅ Dados atualizados com sucesso!');
                setIsOpen(false);
                if (onEnriched) {
                    onEnriched();
                }
            } else {
                console.error('Error response:', data);
                alert(`❌ Erro: ${data.error || 'Falha ao atualizar'}`);
            }
        } catch (error: any) {
            console.error('Network or parsing error:', error);
            alert(`❌ Erro: ${error.message}`);
        } finally {
            setEnriching(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                    setIsOpen(true);
                    setSearchQuery(movie.title);
                    setResults([]);
                }}
            >
                <Search className="w-4 h-4" />
                Buscar no TMDB
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalHeader>
                    <h2 className="text-xl font-bold">Buscar Dados no TMDB</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Procure e selecione o resultado correto para "{movie.title}"
                    </p>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">
                        {/* Search Input */}
                        <div className="flex gap-2">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Digite o título para buscar..."
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={searching}>
                                {searching ? "Buscando..." : "Buscar"}
                            </Button>
                        </div>

                        {/* Results */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {results.length === 0 && !searching && (
                                <p className="text-center text-muted-foreground py-8">
                                    Faça uma busca para ver os resultados
                                </p>
                            )}

                            {results.map((result) => (
                                <button
                                    key={`${result.media_type}-${result.tmdb_id}`}
                                    onClick={() => handleSelectResult(result)}
                                    disabled={enriching}
                                    className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left flex gap-3 group disabled:opacity-50"
                                >
                                    {result.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                                            alt={result.title}
                                            className="w-12 h-18 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-18 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                            Sem poster
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                    {result.title}
                                                </h4>
                                                {result.release_year && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {result.release_year} • {result.media_type === 'tv' ? 'Série' : 'Filme'}
                                                    </span>
                                                )}
                                            </div>
                                            {result.rating > 0 && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                                                    {result.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                        {result.overview && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {result.overview}
                                            </p>
                                        )}
                                    </div>

                                    <Check className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
