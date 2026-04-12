'use client'
import {FunctionComponent, useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {contactInfo, socialLinks} from '@/constants/site'
import {classNames} from '@/components/utils/classNames'
import Overlay from '@/components/Overlay'
import {DogEar} from '@/components/DogEar/DogEar'
import styles from './MobileNav.module.scss'

export const MobileNav: FunctionComponent = () => {
    const t = useTranslations('Navigation')
    const tContact = useTranslations('OverlayContact')
    const [visible, setVisible] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight)
        }
        window.addEventListener('scroll', onScroll, {passive: true})
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNavClick = (hash: string) => {
        setMenuOpen(false)
        const el = document.getElementById(hash)
        if (el) {
            el.scrollIntoView({behavior: 'smooth'})
        }
    }

    return (
        <>
            <div className={classNames([styles.bar, visible && styles.barVisible])}>
                <a
                    href="#"
                    className={styles.logoLink}
                    onClick={(e) => {
                        e.preventDefault()
                        window.scrollTo({top: 0, behavior: 'smooth'})
                    }}
                >
                    <img
                        src="/KK_LOGO_Horizontal.svg"
                        alt="Kultúrne Koncepty"
                        className={classNames([styles.logo, styles.logoHorizontal])}
                    />
                    <img
                        src="/KK_LOGO.svg"
                        alt="Kultúrne Koncepty"
                        className={classNames([styles.logo, styles.logoSquare])}
                    />
                </a>

                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="1" x2="30" y2="1" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="0" y1="13" x2="30" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="0" y1="25" x2="30" y2="25" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                </button>
            </div>

            <Overlay isOpen={menuOpen} handleClose={() => setMenuOpen(false)}>
                <nav className={styles.menuNav}>
                    <DogEar corner="top-right" shadow>
                        <button className={classNames([styles.menuItem, styles.item1])} onClick={() => handleNavClick('who-we-are')}>
                            {t('menu.whoWeAre')}
                        </button>
                    </DogEar>
                    <DogEar corner="top-right" shadow>
                        <button className={classNames([styles.menuItem, styles.item2])} onClick={() => handleNavClick('fields')}>
                            {t('menu.fields')}
                        </button>
                    </DogEar>
                    <DogEar corner="top-right" shadow>
                        <button className={classNames([styles.menuItem, styles.item3])} onClick={() => handleNavClick('projects')}>
                            {t('menu.projects')}
                        </button>
                    </DogEar>
                </nav>

                <div className={styles.menuContact}>
                    <h2 className={styles.contactTitle}>{tContact('title')}</h2>
                    <div className={styles.contactInfo}>
                        <a href={`mailto:${contactInfo.email}`} className={styles.contactEmail}>
                            {contactInfo.email}
                        </a>
                        <div className={styles.contactAddress}>
                            <p>{contactInfo.address.street}</p>
                            <p>{contactInfo.address.city}</p>
                        </div>
                        <p className={styles.contactDetail}>IČO: {contactInfo.ico}</p>
                        <p className={styles.contactDetail}>© {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                        <p className={styles.contactDetail}>{tContact('allRightsReserved')}</p>
                    </div>
                </div>

                <div className={styles.menuContact}>
                    <h2 className={styles.contactTitle}>{tContact('followUs')}</h2>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactSocial}>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <img src="/fb.svg" alt="Facebook" className={styles.socialIcon}/>
                            </a>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <img src="/ig.svg" alt="Instagram" className={styles.socialIcon}/>
                            </a>
                        </div>
                    </div>
                </div>
            </Overlay>
        </>
    )
}
