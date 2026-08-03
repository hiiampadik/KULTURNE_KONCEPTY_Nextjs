import {defineRouting} from 'next-intl/routing'

export const routing = defineRouting({
    // EN mutácia dočasne vypnutá – vrátiť späť, keď budú hotové preklady zo Sanity.
    // Stačí obnoviť pôvodné pole locales (a odkomentovať súvisiace miesta: LocaleSwitcher v Navigation.tsx a hreflang="en" v app/[locale]/layout.tsx).
    // locales: ['sk', 'en'],
    locales: ['sk'],
    defaultLocale: 'sk',
    localeDetection: false,
})
