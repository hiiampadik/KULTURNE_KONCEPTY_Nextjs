'use client'
import {useLocale} from 'next-intl'
import {usePathname, Link} from '@/localization/navigation'
import styles from './Navigation.module.scss'

export function LocaleSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const otherLocale = locale === 'sk' ? 'En' : 'Sk'

    return (
        <Link href={pathname} locale={otherLocale} className={styles.langSwitch}>
            {otherLocale}
        </Link>
    )
}
