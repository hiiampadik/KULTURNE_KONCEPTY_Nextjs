import React, {FunctionComponent} from 'react'
import {useTranslations} from 'next-intl'
import {LocaleSwitcher} from './LocaleSwitcher'
import styles from './Navigation.module.scss'

export const Navigation: FunctionComponent = () => {
    const t = useTranslations('Navigation')

    return (
        <nav className={styles.nav}>

            <div className={styles.top}>
                <LocaleSwitcher/>
                <div className={styles.social}>
                    <a href="#" className={styles.socialLink}>FB</a>
                    <a href="#" className={styles.socialLink}>IG</a>
                </div>
                <a href="#" className={styles.contact}>{t('contact')}</a>
            </div>

            <div className={styles.logo}>
                {/* logo placeholder */}
            </div>

            <ul className={styles.menu}>
                <li><a href="#" className={styles.menuItem}>{t('menu.whoWeAre')}</a></li>
                <li><a href="#" className={styles.menuItem}>{t('menu.areas')}</a></li>
                <li><a href="#" className={styles.menuItem}>{t('menu.projects')}</a></li>
            </ul>

        </nav>
    )
}
