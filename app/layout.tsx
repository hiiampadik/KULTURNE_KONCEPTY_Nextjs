import type {Metadata} from 'next'
import '../styles/globals.scss'
import {siteUrl, socialLinks} from '@/constants/site'

const baseURL = siteUrl
const description = '' // TODO
const keywords = '' // TODO

export const metadata: Metadata = {
    metadataBase: new URL(baseURL),
    alternates: {canonical: baseURL},
    title: 'Kultúrne Koncepty',
    description: description,
    keywords: keywords,
    robots: 'index, follow',
    openGraph: {
        siteName: 'Kultúrne Koncepty',
        title: 'Kultúrne Koncepty',
        description,
        type: 'website',
        url: baseURL,
        locale: 'sk_SK',
        images: [
            {
                url: baseURL + 'favicon/web-app-manifest-512x512.png',
                type: 'image/png',
                width: 512,
                height: 512,
            },
        ],
    },
    twitter: {
        // TODO: zmeniť na 'summary_large_image' keď bude vlastný OG obrázok (1200×630px landscape).
        // Momentálne je obrázok 512×512 (square), čo nezodpovedá 'summary_large_image'.
        card: 'summary',
        title: 'Kultúrne Koncepty',
        description,
        images: [
            {
                url: baseURL + 'favicon/web-app-manifest-512x512.png',
                type: 'image/png',
                width: 512,
                height: 512,
            },
        ],
    },
    icons: {
        icon: [
            {url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png'},
            {url: '/favicon/favicon.svg', type: 'image/svg+xml'},
        ],
        apple: '/favicon/apple-touch-icon.png',
    },
    appleWebApp: {
        title: 'Kultúrne Koncepty',
    },
    manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return children
}
