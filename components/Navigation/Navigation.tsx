'use client'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {useTranslations} from 'next-intl'
import {Link, usePathname} from '@/localization/navigation'
// EN mutácia dočasne vypnutá – prepínač jazykov skrytý, kým nebudú preklady zo Sanity (viď localization/routing.ts)
// import {LocaleSwitcher} from './LocaleSwitcher'
import {ThemeToggle} from './ThemeToggle'
import {socialLinks} from '@/constants/site'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './Navigation.module.scss'
import {classNames} from '@/components/utils/classNames';
import {DogEar} from '@/components/DogEar/DogEar';
import {OverlayContact} from '@/components/OverlayContact/OverlayContact';
import {OverlaySupport} from '@/components/OverlaySupport/OverlaySupport';
import {useDogEarSync} from '@/contexts/DogEarSync';

interface NavigationProps {
    readonly contacts?: SimpleBlockContent
    readonly collaboration?: SimpleBlockContent
    readonly info?: SimpleBlockContent
    readonly support?: SimpleBlockContent
}

export const Navigation: FunctionComponent<NavigationProps> = ({contacts, collaboration, info, support}) => {
    const t = useTranslations('Navigation')
    const tSupport = useTranslations('OverlaySupport')
    const [contactOpen, setContactOpen] = useState(false)
    const [supportOpen, setSupportOpen] = useState(false)
    const {hoveredSection, setHoveredSection} = useDogEarSync()
    // usePathname() (next-intl) je bez prefixu locale: '/' na domovskej, '/projekty/...' na detaile.
    const pathname = usePathname()
    const isHome = pathname === '/'

    const topRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLAnchorElement>(null)
    const menuItem1Ref = useRef<HTMLDivElement>(null)
    const menuItem2Ref = useRef<HTMLDivElement>(null)
    const menuItem3Ref = useRef<HTMLDivElement>(null)
    const supportCornerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const items = [
            topRef.current,
            logoRef.current,
            menuItem1Ref.current,
            menuItem2Ref.current,
            menuItem3Ref.current,
            supportCornerRef.current,
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
            <nav className={classNames([styles.nav, !isHome && styles.detail])}>

                <div ref={topRef} className={classNames([styles.top, styles.navRevealItem])}>
                    {/* EN mutácia dočasne vypnutá – prepínač jazykov skrytý, kým nebudú preklady zo Sanity */}
                    {/*<LocaleSwitcher/>*/}
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
                    {/* Vždy rovnaký element (Link), aby sa DOM uzol pri zmene routy nerekreoval a
                        neprišiel o reveal (inak by logo po otvorení modálu / navigácii zmizlo –
                        navRevealItem má visibility:hidden a reveal beží len raz pri mounte). */}
                    <Link ref={logoRef} href="/" className={classNames([styles.logo, styles.navRevealItem])}
                          onClick={(e) => {
                              if (isHome) {
                                  e.preventDefault()
                                  window.scrollTo({top: 0, behavior: 'smooth'})
                              }
                          }}>
                        <img src="/KK_LOGO.svg" alt="Kultúrne Koncepty" className={styles.logoImage}/>
                    </Link>

                    <div className={styles.menu}>
                        {[
                            {key: 'who-we-are', label: t('menu.whoWeAre'), cls: styles.item1, itemRef: menuItem1Ref},
                            {key: 'fields', label: t('menu.fields'), cls: styles.item2, itemRef: menuItem2Ref},
                            {key: 'projects', label: t('menu.projects'), cls: styles.item3, itemRef: menuItem3Ref},
                        ].map(({key, label, cls, itemRef}) => (
                            <div key={key} ref={itemRef} className={styles.navRevealItem}>
                                <DogEar corner={'top-right'} shadow={true}
                                        forceHover={hoveredSection === key}
                                        onMouseEnter={() => setHoveredSection(key)}
                                        onMouseLeave={() => setHoveredSection(null)}>
                                    {isHome ? (
                                        <a className={classNames([styles.menuItem, cls])} href={`#${key}`}
                                           onClick={() => setContactOpen(false)}>{label}</a>
                                    ) : (
                                        <Link className={classNames([styles.menuItem, cls])} href={`/#${key}`}
                                              onClick={() => setContactOpen(false)}>{label}</Link>
                                    )}
                                </DogEar>
                            </div>
                        ))}
                    </div>
                </div>

                <div ref={supportCornerRef} className={classNames([styles.supportCorner, styles.navRevealItem])}>
                    <button
                        type="button"
                        className={styles.supportButton}
                        onClick={() => setSupportOpen(true)}
                    >
                        {tSupport('title')}
                    </button>
                </div>

            </nav>


            <OverlayContact isOpen={contactOpen} handleClose={() => setContactOpen(false)} contacts={contacts}
                            collaboration={collaboration} info={info}/>
            <OverlaySupport isOpen={supportOpen} handleClose={() => setSupportOpen(false)} support={support}/>
        </>
    )
}
