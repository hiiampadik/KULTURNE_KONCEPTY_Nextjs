import React, {FunctionComponent} from 'react'
import {useTranslations} from 'next-intl'
import {LocaleSwitcher} from './LocaleSwitcher'
import {socialLinks} from '@/constants/site'
import styles from './Navigation.module.scss'
import {classNames} from '@/components/utils/classNames';
import {DogEar} from '@/components/DogEar/DogEar';

export const Navigation: FunctionComponent = () => {
    const t = useTranslations('Navigation')

    return (
        <nav className={styles.nav}>

            <div className={styles.top}>
                <LocaleSwitcher/>
                <a href="#" className={styles.contact}>{t('contact')}</a>
                <div className={styles.social}>
                    <a href={socialLinks.instagram} className={styles.socialLink} target="_blank"
                       rel="noopener noreferrer">IG</a>
                    <a href={socialLinks.facebook} className={styles.socialLink} target="_blank"
                       rel="noopener noreferrer">FB</a>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.logo}>
                    <img src="/KK_LOGO.svg" alt="Kultúrne Koncepty" className={styles.logoImage}/>
                </div>

                <div className={styles.menu}>
                    <DogEar corner={'bottom-right'} shadow={true}>
                        <a className={classNames([styles.menuItem, styles.item1])} href="#">{t('menu.whoWeAre')}</a>
                    </DogEar>
                    <a className={classNames([styles.menuItem, styles.item2])} href="#">{t('menu.areas')}</a>
                    <DogEar corner={'bottom-right'} shadow={true}>
                        <a className={classNames([styles.menuItem, styles.item3])} href="#">{t('menu.projects')}</a>
                    </DogEar>
                </div>
            </div>
        </nav>
    )
}
