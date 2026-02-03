import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart3, Users, Shuffle, Film, Dices } from "lucide-react";
import { TMDBAttribution } from "@/components/tmdb-attribution";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-2xl animate-in">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl gradient-primary">
                        <Film className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        CineCouple
                    </h1>
                </div>

                {/* Tagline */}
                <p className="text-xl md:text-2xl text-muted-foreground">
                    Seu catálogo de filmes a dois 🎬
                </p>

                <p className="text-muted-foreground">
                    Acabe com a indecisão na hora de escolher o que assistir!
                    Centralize Netflix, Disney+ e HBO Max em um só lugar.
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="glass p-4 rounded-xl">
                        <Film className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Catálogo Unificado</h3>
                        <p className="text-sm text-muted-foreground">
                            Todos os seus filmes e séries em um lugar só
                        </p>
                    </div>

                    <Link href="/randomizer" className="glass p-4 rounded-xl hover:bg-card/80 transition-all cursor-pointer group">
                        <Dices className="w-8 h-8 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold">Randomizer</h3>
                        <p className="text-sm text-muted-foreground">
                            Deixe o destino escolher o próximo filme!
                        </p>
                    </Link>

                    <div className="glass p-4 rounded-xl">
                        <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
                        <h3 className="font-semibold">Avaliações</h3>
                        <p className="text-sm text-muted-foreground">
                            Registre suas memórias e notas de cada filme
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                        href="/login"
                        className="px-8 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-3 rounded-xl glass hover:bg-card transition-colors font-semibold"
                    >
                        Criar Conta
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center space-y-4 py-8">
                <TMDBAttribution />
                <p className="text-muted-foreground">
                    Feito com ❤️ por Arthur e Malu
                </p>
            </footer>
        </main>
    );
}
