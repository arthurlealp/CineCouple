"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Check, Film, Tv, TrendingUp, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { EmptyState } from "@/components/empty-state";
import { DiscoverGridSkeleton } from "@/components/ui/skeleton";

interface DiscoverResult {
    tmdb_id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    rating: number;
    release_year: number | null;
    media_type: 'movie' | 'tv';
}

export default function DiscoverPage() {
    const router = useRouter();
    const toast = useToast();
    const [results, setResults] = useState<DiscoverResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');
    const [addingId, setAddingId] = useState<number | null>(null);
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
    const [selectedPlatform, setSelectedPlatform] = useState('netflix');

    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const fetchContent = async (query?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            if (activeTab !== 'all') params.set('type', activeTab);
            params.set('category', 'trending');

            const response = await fetch(`/api/tmdb/discover?${params.toString()}`);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchContent(searchQuery);
        } else {
            fetchContent();
        }
    };

    const handleAddToList = async (item: DiscoverResult) => {
        setAddingId(item.tmdb_id);
        try {
            const response = await fetch('/api/movies/add-from-tmdb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tmdb_id: item.tmdb_id,
                    media_type: item.media_type,
                    platform: selectedPlatform
                })
            });

            const data = await response.json();

            if (response.ok) {
                setAddedIds(prev => new Set(Array.from(prev).concat(item.tmdb_id)));
                toast.success(`"${item.title}" adicionado à sua lista!`);
            } else if (data.exists) {
                setAddedIds(prev => new Set(Array.from(prev).concat(item.tmdb_id)));
                toast.info("Este título já está na sua lista");
            } else {
                toast.error(data.error || "Erro ao adicionar");
            }
        } catch (error: any) {
            toast.error(error.message || "Erro de conexão");
        }
        setAddingId(null);
    };

    const tabs = [
        { id: 'all', label: 'Em Alta', icon: TrendingUp },
        { id: 'movie', label: 'Filmes', icon: Film },
        { id: 'tv', label: 'Séries', icon: Tv },
    ];

    const platforms = [
        { id: 'netflix', label: 'Netflix', color: 'bg-red-600' },
        { id: 'disney', label: 'Disney+', color: 'bg-blue-600' },
        { id: 'hbo', label: 'HBO Max', color: 'bg-purple-600' },
    ];

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Descobrir</h1>
                        <p className="text-muted-foreground">
                            Explore filmes e séries populares do TMDB
                        </p>
                    </div>
                    <Button variant="ghost" className="gap-2" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar filmes e séries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="max-w-md"
                    />
                    <Button onClick={handleSearch}>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                    </Button>
                    {searchQuery && (
                        <Button variant="ghost" onClick={() => { setSearchQuery(''); fetchContent(); }}>
                            Limpar
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab(tab.id as any)}
                            className="gap-2"
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Platform selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Adicionar em:</span>
                    {platforms.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPlatform(p.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedPlatform === p.id
                                ? `${p.color} text-white`
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <DiscoverGridSkeleton count={12} />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {results.map(item => (
                        <div
                            key={`${item.media_type}-${item.tmdb_id}`}
                            className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
                        >
                            {/* Poster */}
                            <div className="aspect-[2/3] relative">
                                {item.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <span className="text-3xl font-bold text-muted-foreground/30">
                                            {item.title.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Type badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.media_type === 'tv'
                                        ? 'bg-blue-500/90 text-white'
                                        : 'bg-purple-500/90 text-white'
                                        }`}>
                                        {item.media_type === 'tv' ? 'Série' : 'Filme'}
                                    </span>
                                </div>

                                {/* Rating */}
                                {item.rating > 0 && (
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-yellow-500/90 text-black text-xs font-bold">
                                        {item.rating.toFixed(1)}
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                                    <p className="text-xs text-white/80 line-clamp-4 mb-2">
                                        {item.overview || 'Sem descrição disponível'}
                                    </p>

                                    {addedIds.has(item.tmdb_id) ? (
                                        <Button size="sm" variant="secondary" disabled className="w-full gap-2">
                                            <Check className="w-4 h-4" />
                                            Na Lista
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="w-full gap-2"
                                            onClick={() => handleAddToList(item)}
                                            disabled={addingId === item.tmdb_id}
                                        >
                                            {addingId === item.tmdb_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            Adicionar
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="p-2">
                                <h3 className="font-medium text-sm truncate">{item.title}</h3>
                                {item.release_year && (
                                    <p className="text-xs text-muted-foreground">{item.release_year}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && (
                <EmptyState variant="no-results" />
            )}
        </div>
    );
}
