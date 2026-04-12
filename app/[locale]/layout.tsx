import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {routing} from '@/localization/routing'
import {Navigation} from '@/components/Navigation/Navigation'
import {MobileNav} from '@/components/MobileNav/MobileNav'
import {Footer} from '@/components/Footer/Footer'
import {DogEarSyncProvider} from '@/contexts/DogEarSync'

export function generateStaticParams() {
    return routing.locales.map(locale => ({locale}))
}

export default async function LocaleLayout({children}: {children: React.ReactNode}) {
    const messages = await getMessages()
    return (
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
    )
}
