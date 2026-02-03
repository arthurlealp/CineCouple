import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "CineCouple | Seu catálogo de filmes a dois 🎬",
    description:
        "Gerencie o catálogo de filmes e séries do casal. Acabe com a indecisão na hora de escolher o que assistir!",
    keywords: ["filmes", "séries", "casal", "netflix", "disney", "hbo", "watchlist"],
    authors: [{ name: "Arthur Leal Pacheco" }],
    openGraph: {
        title: "CineCouple | Seu catálogo de filmes a dois 🎬",
        description: "Gerencie o catálogo de filmes e séries do casal.",
        type: "website",
        locale: "pt_BR",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0f172a",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

