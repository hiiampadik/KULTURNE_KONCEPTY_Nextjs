'use client'
import {FunctionComponent, useEffect, useRef} from 'react'
import {useTranslations} from 'next-intl'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {socialLinks, contactInfo} from '@/constants/site'
import styles from './Footer.module.scss'

gsap.registerPlugin(ScrollTrigger)

export const Footer: FunctionComponent = () => {
    const t = useTranslations('Footer')
    const footerRef = useRef<HTMLElement>(null)
    const contentRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const footer = footerRef.current
        const items = contentRefs.current.filter(Boolean)
        if (!footer || items.length === 0) return

        gsap.set(items, {
            visibility: 'visible',
            clipPath: 'inset(100% 0 0 0)',
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                once: true,
            },
        })

        tl.to(items, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            onComplete: () => {
                gsap.set(items, {clearProps: 'clipPath'})
            },
        })

        return () => {
            tl.kill()
        }
    }, [])

    return (
        <footer ref={footerRef} className={styles.footer}>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <div ref={el => { contentRefs.current[0] = el }} className={styles.columnContent}>
                        <h2 className={styles.heading}>{t('contact')}</h2>
                        <a href={`mailto:${contactInfo.email}`} className={styles.link}>
                            {contactInfo.email}
                        </a>
                    </div>
                </div>

                <div className={styles.column}>
                    <div ref={el => { contentRefs.current[1] = el }} className={styles.columnContent}>
                        <h2 className={styles.heading}>{t('followUs')}</h2>
                        <div className={styles.social}>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <img src="/fb.svg" alt="" aria-hidden="true" className={styles.socialIcon}/>
                            </a>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <img src="/ig.svg" alt="" aria-hidden="true" className={styles.socialIcon}/>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <div ref={el => { contentRefs.current[2] = el }} className={styles.columnContent}>
                        <div className={styles.address}>
                            <p>{contactInfo.address.street}</p>
                            <p>{contactInfo.address.city}</p>
                        </div>
                        <p className={styles.detail}>IČO: {contactInfo.ico}</p>
                    </div>
                </div>

                <div className={styles.column}>
                    <div ref={el => { contentRefs.current[3] = el }} className={styles.columnContent}>
                        <p className={styles.detail}>&copy; {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                        <p className={styles.detail}>{t('allRightsReserved')}</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
