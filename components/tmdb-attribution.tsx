import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function TMDBAttribution() {
    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB Logo"
                className="h-4 opacity-70"
            />
            <span>
                This product uses the TMDB API but is not endorsed or certified by TMDB.
            </span>
            <Link
                href="https://www.themoviedb.org/"
                target="_blank"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
                Learn more <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
    );
}
