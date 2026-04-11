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
import {useDogEarSync} from '@/contexts/DogEarSync';

export const Navigation: FunctionComponent = () => {
    const t = useTranslations('Navigation')
    const [contactOpen, setContactOpen] = useState(false)
    const {hoveredSection, setHoveredSection} = useDogEarSync()

    return (
        <>
            <nav className={styles.nav}>

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
                    <ThemeToggle/>
                </div>

                <div className={styles.bottom}>
                    <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}) }}>
                        <img src="/KK_LOGO.svg" alt="Kultúrne Koncepty" className={styles.logoImage}/>
                    </a>

                    <div className={styles.menu}>
                        <DogEar corner={'top-right'} shadow={true}
                            forceHover={hoveredSection === 'who-we-are'}
                            onMouseEnter={() => setHoveredSection('who-we-are')}
                            onMouseLeave={() => setHoveredSection(null)}>
                            <a className={classNames([styles.menuItem, styles.item1])} href="#who-we-are" onClick={() => setContactOpen(false)}>{t('menu.whoWeAre')}</a>
                        </DogEar>
                        <DogEar corner={'top-right'} shadow={true}
                            forceHover={hoveredSection === 'fields'}
                            onMouseEnter={() => setHoveredSection('fields')}
                            onMouseLeave={() => setHoveredSection(null)}>
                            <a className={classNames([styles.menuItem, styles.item2])} href="#fields"
                               onClick={() => setContactOpen(false)}>{t('menu.fields')}</a>
                        </DogEar>
                        <DogEar corner={'top-right'} shadow={true}
                            forceHover={hoveredSection === 'projects'}
                            onMouseEnter={() => setHoveredSection('projects')}
                            onMouseLeave={() => setHoveredSection(null)}>
                            <a className={classNames([styles.menuItem, styles.item3])} href="#projects" onClick={() => setContactOpen(false)}>{t('menu.projects')}</a>
                        </DogEar>
                    </div>
                </div>

            </nav>

            <OverlayContact isOpen={contactOpen} handleClose={() => setContactOpen(false)}/>
        </>
    )
}
