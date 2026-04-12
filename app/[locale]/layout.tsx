import {GeistMono} from 'geist/font/mono'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {routing} from '@/localization/routing'
import {Navigation} from '@/components/Navigation/Navigation'
import {MobileNav} from '@/components/MobileNav/MobileNav'
import {Footer} from '@/components/Footer/Footer'
import {DogEarSyncProvider} from '@/contexts/DogEarSync'
import {siteUrl, socialLinks} from '@/constants/site'

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
    const messages = await getMessages()
    return (
        <html lang={locale} className={GeistMono.variable}>
            <head>
                <link rel="stylesheet" href="https://use.typekit.net/qcq1nxm.css"/>
            </head>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
                />
                <NextIntlClientProvider messages={messages}>
                    <DogEarSyncProvider>
                        <Navigation/>
                        <MobileNav/>
                        <main>
                            {children}
                        </main>
                    </DogEarSyncProvider>
                    <Footer/>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
