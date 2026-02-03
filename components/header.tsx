"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { List, X, Popcorn, House, Stack, SignOut, Compass, DiceFive } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
    { href: "/dashboard", label: "Início", icon: House },
    { href: "/catalog", label: "Catálogo", icon: Stack },
    { href: "/discover", label: "Descobrir", icon: Compass },
    { href: "/randomizer", label: "Roleta", icon: DiceFive },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg gradient-primary group-hover:scale-110 transition-transform">
                            <Popcorn weight="fill" className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wide">
                            CineCouple
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon weight={isActive ? "fill" : "duotone"} className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            title="Sair"
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <SignOut weight="duotone" className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X weight="bold" className="w-6 h-6" /> : <List weight="bold" className="w-6 h-6" />}
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Panel */}
            <div
                className={cn(
                    "fixed top-16 right-0 z-30 w-64 h-[calc(100vh-4rem)] bg-background border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <nav className="flex flex-col p-4 gap-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon weight={isActive ? "fill" : "duotone"} className="w-6 h-6" />
                                {link.label}
                            </Link>
                        );
                    })}

                    <hr className="my-4 border-border" />

                    <button
                        onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <SignOut weight="duotone" className="w-6 h-6" />
                        Sair
                    </button>
                </nav>
            </div>
        </>
    );
}
