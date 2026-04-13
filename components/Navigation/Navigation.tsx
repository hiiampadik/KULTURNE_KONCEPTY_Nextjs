'use client'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
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

    const topRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLAnchorElement>(null)
    const menuItem1Ref = useRef<HTMLDivElement>(null)
    const menuItem2Ref = useRef<HTMLDivElement>(null)
    const menuItem3Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const items = [
            topRef.current,
            logoRef.current,
            menuItem1Ref.current,
            menuItem2Ref.current,
            menuItem3Ref.current,
        ].filter(Boolean)

        // Find DogEar elements inside menu items that have their own CSS shadow
        const menuItems = [menuItem1Ref.current, menuItem2Ref.current, menuItem3Ref.current].filter(Boolean)
        const innerShadowEls = menuItems.map(el => el!.querySelector(':scope > [class*="shadow"]')).filter(Boolean)

        gsap.set(items, {
            visibility: 'visible',
            clipPath: 'inset(100% 0 0 0)',
            filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0))',
        })

        gsap.set(innerShadowEls, {filter: 'none'})

        const tl = gsap.timeline()

        tl.to(items, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            onComplete: () => {
                gsap.set(items, {clearProps: 'clipPath'})
            },
        })

        tl.to(items, {
            filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.15))',
            duration: 0.4,
            onComplete: () => {
                items.forEach(el => {
                    if (el) {
                        gsap.set(el, {clearProps: 'all'})
                        el.classList.remove(styles.navRevealItem)
                    }
                })
                gsap.set(innerShadowEls, {clearProps: 'filter'})
            },
        })
    }, [])

    return (
        <>
            <nav className={styles.nav}>

                <div ref={topRef} className={classNames([styles.top, styles.navRevealItem])}>
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
                    <a ref={logoRef} href="#" className={classNames([styles.logo, styles.navRevealItem])} onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}) }}>
                        <img src="/KK_LOGO.svg" alt="Kultúrne Koncepty" className={styles.logoImage}/>
                    </a>

                    <div className={styles.menu}>
                        <div ref={menuItem1Ref} className={styles.navRevealItem}>
                            <DogEar corner={'top-right'} shadow={true}
                                forceHover={hoveredSection === 'who-we-are'}
                                onMouseEnter={() => setHoveredSection('who-we-are')}
                                onMouseLeave={() => setHoveredSection(null)}>
                                <a className={classNames([styles.menuItem, styles.item1])} href="#who-we-are" onClick={() => setContactOpen(false)}>{t('menu.whoWeAre')}</a>
                            </DogEar>
                        </div>
                        <div ref={menuItem2Ref} className={styles.navRevealItem}>
                            <DogEar corner={'top-right'} shadow={true}
                                forceHover={hoveredSection === 'fields'}
                                onMouseEnter={() => setHoveredSection('fields')}
                                onMouseLeave={() => setHoveredSection(null)}>
                                <a className={classNames([styles.menuItem, styles.item2])} href="#fields"
                                   onClick={() => setContactOpen(false)}>{t('menu.fields')}</a>
                            </DogEar>
                        </div>
                        <div ref={menuItem3Ref} className={styles.navRevealItem}>
                            <DogEar corner={'top-right'} shadow={true}
                                forceHover={hoveredSection === 'projects'}
                                onMouseEnter={() => setHoveredSection('projects')}
                                onMouseLeave={() => setHoveredSection(null)}>
                                <a className={classNames([styles.menuItem, styles.item3])} href="#projects" onClick={() => setContactOpen(false)}>{t('menu.projects')}</a>
                            </DogEar>
                        </div>
                    </div>
                </div>

            </nav>

            <OverlayContact isOpen={contactOpen} handleClose={() => setContactOpen(false)}/>
        </>
    )
}
