'use client'
import React, {FunctionComponent, useState} from 'react'
import {useTranslations} from 'next-intl'
import {LocaleSwitcher} from './LocaleSwitcher'
import {ThemeToggle} from './ThemeToggle'
import {socialLinks} from '@/constants/site'
import styles from './Navigation.module.scss'
import {classNames} from '@/components/utils/classNames';
import {DogEar} from '@/components/DogEar/DogEar';
import {OverlayContact} from '@/components/OverlayContact/OverlayContact';

export const Navigation: FunctionComponent = () => {
    const t = useTranslations('Navigation')
    const [contactOpen, setContactOpen] = useState(false)

    return (
        <>
            <nav className={styles.nav}>

                <DogEar corner={'top-right'} shadow={true}>
                    <div className={styles.top}>
                        <LocaleSwitcher/>
                        <button
                            className={styles.contact}
                            onClick={() => setContactOpen(prev => !prev)}
                        >
                            {t('contact')}
                        </button>
                        <div className={styles.social}>
                            <a href={socialLinks.instagram} className={styles.socialLink} target="_blank"
                               rel="noopener noreferrer">IG</a>
                            <a href={socialLinks.facebook} className={styles.socialLink} target="_blank"
                               rel="noopener noreferrer">FB</a>
                        </div>
                    </div>
                </DogEar>

                <div className={styles.bottom}>
                    <div className={styles.logo}>
                        <img src="/KK_LOGO.svg" alt="Kultúrne Koncepty" className={styles.logoImage}/>
                    </div>

                    <div className={styles.menu}>
                        <DogEar corner={'bottom-right'} shadow={true}>
                            <a className={classNames([styles.menuItem, styles.item1])} href="#who-we-are" onClick={() => setContactOpen(false)}>{t('menu.whoWeAre')}</a>
                        </DogEar>
                        <a className={classNames([styles.menuItem, styles.item2])} href="#fields" onClick={() => setContactOpen(false)}>{t('menu.fields')}</a>
                        <DogEar corner={'bottom-right'} shadow={true}>
                            <a className={classNames([styles.menuItem, styles.item3])} href="#projects" onClick={() => setContactOpen(false)}>{t('menu.projects')}</a>
                        </DogEar>
                    </div>
                </div>


                <ThemeToggle/>
            </nav>

            <OverlayContact isOpen={contactOpen} handleClose={() => setContactOpen(false)}/>
        </>
    )
}
