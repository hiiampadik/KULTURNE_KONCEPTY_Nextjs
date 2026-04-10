import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {routing} from '@/localization/routing'
import {Navigation} from '@/components/Navigation/Navigation'

export function generateStaticParams() {
    return routing.locales.map(locale => ({locale}))
}

export default async function LocaleLayout({children}: {children: React.ReactNode}) {
    const messages = await getMessages()
    return (
        <NextIntlClientProvider messages={messages}>
            <Navigation/>
            <main>
                {children}
            </main>
        </NextIntlClientProvider>
    )
}
