
import type {Metadata} from 'next'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages, setRequestLocale} from 'next-intl/server'
import {routing} from '@/localization/routing'
import {Navigation} from '@/components/Navigation/Navigation'
import {MobileNav} from '@/components/MobileNav/MobileNav'
import {Footer} from '@/components/Footer/Footer'
import {DogEarSyncProvider} from '@/contexts/DogEarSync'
import {GridTransition} from '@/components/GridTransition/GridTransition'
import {siteUrl, socialLinks} from '@/constants/site'
import {sanityFetch} from '@/sanity/client'
import {footerQuery} from '@/sanity/queries'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const dynamic = 'force-static'
export const revalidate = 60

const baseURL = siteUrl

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${baseURL}#organization`,
            name: 'Kultúrne Koncepty',
            url: baseURL,
            sameAs: [
                socialLinks.facebook,
                socialLinks.instagram,
            ],
        },
        {
            '@type': 'WebSite',
            '@id': `${baseURL}#website`,
            url: baseURL,
            name: 'Kultúrne Koncepty',
            publisher: {'@id': `${baseURL}#organization`},
            description: '',
        },
    ],
}

export function generateStaticParams() {
    return routing.locales.map(locale => ({locale}))
}

// Default canonical for the locale tree (the homepage). Sub-pages (e.g. project
// detail) override `alternates.canonical` in their own generateMetadata.
// hreflang: obnoviť `languages` keď sa vráti EN mutácia (viď localization/routing.ts).
export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
    const {locale} = await params
    return {
        alternates: {
            canonical: `/${locale}`,
        },
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: Promise<{locale: string}>,
}) {
    const {locale} = await params
    setRequestLocale(locale)
    const messages = await getMessages({locale})
    const footerData = await sanityFetch({query: footerQuery, params: {locale}}) as {
        contacts?: SimpleBlockContent
        collaboration?: SimpleBlockContent
        info?: SimpleBlockContent
        support?: SimpleBlockContent
        items?: Array<{_key: string; title: string; url: string; originalFilename?: string; size?: number; extension?: string}>
    } | null
    return (
        <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <head>
            {/* canonical + hreflang sa generujú cez Metadata API (viď generateMetadata vyššie
                a v app/[locale]/projekty/[slug]/page.tsx), nie natvrdo tu. */}
            <link rel="preload" href="/fonts/AnoAngularDiacritics-Light.woff2" as="font" type="font/woff2"
                  crossOrigin="anonymous"/>
            <link rel="stylesheet" href="https://use.typekit.net/hcm5cdz.css"/>


        </head>
        <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
                />
                <GridTransition/>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <DogEarSyncProvider>
                        <Navigation contacts={footerData?.contacts} collaboration={footerData?.collaboration} info={footerData?.info} support={footerData?.support}/>
                        {/*<MobileNav contacts={footerData?.contacts} info={footerData?.info}/>*/}
                        <main>
                            {children}
                        </main>
                    </DogEarSyncProvider>
                    <Footer contacts={footerData?.contacts} info={footerData?.info} items={footerData?.items}/>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
