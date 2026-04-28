import {GeistMono} from 'geist/font/mono'
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

export const dynamic = 'force-static'

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
        info?: SimpleBlockContent
        items?: Array<{_key: string; title: string; url: string; originalFilename?: string; size?: number; extension?: string}>
    } | null
    return (
        <html lang={locale} className={GeistMono.variable}>
            <head>
                <link rel="canonical" href={`${baseURL}${locale}`} />
                <link rel="alternate" href={`${baseURL}sk`} hrefLang="sk" />
                <link rel="alternate" href={`${baseURL}en`} hrefLang="en" />
                <link rel="alternate" href={`${baseURL}sk`} hrefLang="x-default" />
                <link rel="preload" href="/fonts/AnoAngularDiacritics-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
                <link rel="stylesheet" href="https://use.typekit.net/qcq1nxm.css"/>
            </head>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
                />
                <GridTransition/>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <DogEarSyncProvider>
                        <Navigation contacts={footerData?.contacts} info={footerData?.info}/>
                        <MobileNav contacts={footerData?.contacts} info={footerData?.info}/>
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
