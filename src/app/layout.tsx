import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
    title: {
        default: 'MovFlix - Explore Movies',
        template: '%s | MovFlix',
    },
    description: 'Discover movies, explore details, and find your next favorite film with MovFlix.',
    keywords: ['movies', 'films', 'explore movies', 'movie database', 'movie ratings', 'movie trailers'],
    authors: [{ name: 'Sandeep Singh', url: 'https://github.com/NoCashxD' }],
    metadataBase: new URL('https://movflix.vercel.app'),
    openGraph: {
        description: 'Discover movies, explore details, and find your next favorite film with MovFlix.',
        url: 'https://movflix.vercel.app',
        siteName: 'MovFlix',
        images: [
            {
                url: 'https://movflix.vercel.app/banner.png',
                width: 1200,
                height: 630,
                alt: 'MovFlix Banner',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        description: 'Discover movies, explore details, and find your next favorite film with MovFlix.',
        images: ['https://movflix.vercel.app/banner.png'],
    },
    manifest: '/site.webmanifest',
    robots: 'index, follow',
};

export const viewport: Viewport = {
    themeColor: 'black',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={` antialiased dark`}>
                {children}
            </body>
        </html>
    );
}
