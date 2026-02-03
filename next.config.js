/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        const headersList = [
            {
                key: 'X-DNS-Prefetch-Control',
                value: 'on'
            },
            {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff'
            },
            {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN'
            },
            {
                key: 'X-XSS-Protection',
                value: '1; mode=block'
            },
            {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin'
            }
        ];

        // Strict CSP only in production to avoid slowing down dev server (HMR)
        if (process.env.NODE_ENV === 'production') {
            headersList.push({
                key: 'Content-Security-Policy',
                value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://image.tmdb.org https://*.tmdb.org https://www.themoviedb.org https://*.themoviedb.org data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.themoviedb.org; frame-src 'self' https://www.youtube.com;"
            });
        }

        return [
            {
                source: '/:path*',
                headers: headersList
            }
        ];
    },
};

module.exports = nextConfig;
