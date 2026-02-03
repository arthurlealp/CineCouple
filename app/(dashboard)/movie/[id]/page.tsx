"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash, FloppyDisk, CalendarBlank, Star, Clock, PlayCircle, PencilSimple, X, Check, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";
import { PlatformBadge } from "@/components/platform-badge";
import { LoadingScreen } from "@/components/ui/loading";
import { TMDBEnrichButton } from "@/components/tmdb-enrich-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import { createClient } from "@/lib/supabase/client";
import { PLATFORMS, CONTENT_TYPES, WATCH_STATUSES, type Movie, type Platform, type ContentType, type WatchStatus } from "@/lib/types";

export default function MovieDetailsPage({ params }: { params: { id: string } }) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Movie>>({});

    const router = useRouter();
    const supabase = createClient();
    const toast = useToast();

    useEffect(() => {
        async function loadMovie() {
            const { data } = await supabase
                .from("movies")
                .select("*")
                .eq("id", params.id)
                .single();

            if (data) {
                setMovie(data as Movie);
                setFormData(data as Movie);
            }
            setLoading(false);
        }

        loadMovie();
    }, [params.id, supabase]);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from("movies")
            .update({
                title: formData.title,
                platform: formData.platform,
                type: formData.type,
                status: formData.status,
                rating: formData.status === 'watched' ? formData.rating : null,
                watched_at: formData.status === 'watched' && !movie?.watched_at ? new Date().toISOString() : movie?.watched_at
            })
            .eq("id", params.id);

        if (!error) {
            setMovie({ ...movie!, ...formData } as Movie);
            setIsEditing(false);
            toast.success("Alterações salvas!");
            router.refresh();
        } else {
            toast.error("Erro ao salvar");
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("movies").delete().eq("id", params.id);
        if (!error) {
            toast.success("Título removido com sucesso!");
            router.push("/dashboard");
        } else {
            toast.error("Erro ao remover título");
        }
    };

    if (loading) return <LoadingScreen />;
    if (!movie) return <div className="min-h-screen flex items-center justify-center">Filme não encontrado</div>;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return (
        <div className="min-h-screen">
            {/* Immersive Hero with Backdrop */}
            <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] -mt-4 -mx-4 md:-mx-8 lg:-mx-12">
                {/* Background */}
                {backdropUrl ? (
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover object-top blur-sm scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-background" />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <Button variant="ghost" className="gap-2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm" onClick={() => router.back()}>
                        <ArrowLeft weight="bold" className="w-4 h-4" /> Voltar
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <TMDBEnrichButton movie={movie} onEnriched={() => window.location.reload()} />
                    {!isEditing ? (
                        <Button variant="outline" className="gap-2 bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-sm" onClick={() => setIsEditing(true)}>
                            <PencilSimple weight="duotone" className="w-4 h-4" /> Editar
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" className="bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm" onClick={() => setIsEditing(false)}>
                                <X weight="bold" className="w-4 h-4" />
                            </Button>
                            <Button className="gap-2" onClick={handleSave} disabled={saving}>
                                <Check weight="bold" className="w-4 h-4" />
                                {saving ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="flex gap-8 items-end max-w-6xl mx-auto">
                        {/* Poster */}
                        <div className="hidden md:block flex-shrink-0 w-48 lg:w-56">
                            <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                                        {movie.title.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4">
                            {/* Badges */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <PlatformBadge platform={movie.platform} />
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${movie.type === 'series'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    }`}>
                                    {movie.type === 'series' ? '📺 Série' : '🎬 Filme'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${movie.status === 'watched'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : movie.status === 'abandoned'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-accent/20 text-accent border border-accent/30'
                                    }`}>
                                    {WATCH_STATUSES.find(s => s.value === movie.status)?.emoji} {WATCH_STATUSES.find(s => s.value === movie.status)?.label}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="font-display uppercase tracking-widest text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                                {movie.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-white/80 flex-wrap">
                                {movie.tmdb_rating && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                                        <Star weight="fill" className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold text-yellow-400">{movie.tmdb_rating.toFixed(1)}</span>
                                        <span className="text-yellow-400/60">/10</span>
                                    </div>
                                )}
                                {movie.release_year && (
                                    <div className="flex items-center gap-1.5">
                                        <CalendarBlank weight="duotone" className="w-4 h-4" />
                                        <span>{movie.release_year}</span>
                                    </div>
                                )}
                                {movie.runtime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock weight="duotone" className="w-4 h-4" />
                                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                                    </div>
                                )}
                                {movie.status === 'watched' && movie.rating && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                                        <span className="text-sm">Nossa nota:</span>
                                        <StarRating value={movie.rating} readonly size="sm" />
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {movie.genres.map((genre, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Content Below Hero */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {isEditing ? (
                    /* Edit Mode */
                    <div className="space-y-6 p-6 rounded-2xl bg-card border border-border">
                        <h2 className="text-xl font-bold">Editar Informações</h2>

                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="text-lg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Plataforma</Label>
                                <Select
                                    options={PLATFORMS}
                                    value={formData.platform || "netflix"}
                                    onChange={val => setFormData({ ...formData, platform: val as Platform })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    options={CONTENT_TYPES}
                                    value={formData.type || "movie"}
                                    onChange={val => setFormData({ ...formData, type: val as ContentType })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex flex-wrap gap-2">
                                {WATCH_STATUSES.map(status => (
                                    <button
                                        key={status.value}
                                        onClick={() => setFormData({ ...formData, status: status.value })}
                                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2
                                            ${formData.status === status.value
                                                ? "bg-primary text-primary-foreground border-primary scale-105"
                                                : "bg-muted hover:bg-muted/80 border-border"}`}
                                    >
                                        <span>{status.emoji}</span>
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.status === 'watched' && (
                            <div className="space-y-2 animate-in fade-in">
                                <Label>Nossa Avaliação</Label>
                                <div className="p-6 rounded-xl bg-muted/50 flex justify-center">
                                    <StarRating
                                        value={formData.rating || 0}
                                        onChange={val => setFormData({ ...formData, rating: val })}
                                        size="lg"
                                    />
                                </div>
                            </div>
                        )}

                        <ConfirmDialog
                            title="Excluir Título"
                            message={`Tem certeza que deseja remover "${movie.title}" da sua lista? Esta ação não pode ser desfeita.`}
                            confirmText="Excluir"
                            cancelText="Cancelar"
                            variant="danger"
                            onConfirm={handleDelete}
                            trigger={
                                <Button variant="outline" className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
                                    <Trash weight="duotone" className="w-4 h-4" /> Excluir Título
                                </Button>
                            }
                        />
                    </div>
                ) : (
                    /* View Mode */
                    <>
                        {/* Synopsis */}
                        {movie.overview && (
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold">Sinopse</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {movie.overview}
                                </p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Info Card */}
                            <div className="glass rounded-2xl p-6 space-y-4">
                                <h3 className="font-semibold text-lg">Detalhes</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Plataforma</span>
                                        <PlatformBadge platform={movie.platform} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Tipo</span>
                                        <span className="font-medium">{movie.type === 'series' ? 'Série' : 'Filme'}</span>
                                    </div>
                                    {movie.release_year && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Ano</span>
                                            <span className="font-medium">{movie.release_year}</span>
                                        </div>
                                    )}
                                    {movie.runtime && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Duração</span>
                                            <span className="font-medium">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="glass rounded-2xl p-6 space-y-4">
                                <h3 className="font-semibold text-lg">Status do Casal 💜</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="font-medium flex items-center gap-2">
                                            {WATCH_STATUSES.find(s => s.value === movie.status)?.emoji}
                                            {WATCH_STATUSES.find(s => s.value === movie.status)?.label}
                                        </span>
                                    </div>
                                    {movie.status === 'watched' && movie.rating && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Nossa Nota</span>
                                            <StarRating value={movie.rating} readonly size="md" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Adicionado em</span>
                                        <span className="font-medium">
                                            {new Date(movie.added_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    {movie.watched_at && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Assistido em</span>
                                            <span className="font-medium">
                                                {new Date(movie.watched_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TMDB Link */}
                        {movie.tmdb_id && (
                            <div className="flex justify-center">
                                <a
                                    href={`https://www.themoviedb.org/${movie.type === 'series' ? 'tv' : 'movie'}/${movie.tmdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ArrowSquareOut weight="bold" className="w-4 h-4" />
                                    Ver no TMDB
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
