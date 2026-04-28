'use client'
import {FunctionComponent, useEffect, useRef, useState} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {socialLinks, contactInfo} from '@/constants/site'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import Overlay from '@/components/Overlay'
import styles from './Footer.module.scss'

gsap.registerPlugin(ScrollTrigger)

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export interface FooterItem {
    readonly _key: string
    readonly title: string
    readonly url: string
    readonly originalFilename?: string
    readonly size?: number
    readonly extension?: string
}

interface FooterProps {
    readonly contacts?: SimpleBlockContent
    readonly info?: SimpleBlockContent
    readonly items?: FooterItem[]
}

export const Footer: FunctionComponent<FooterProps> = ({contacts, info, items}) => {
    const t = useTranslations('Footer')
    const footerRef = useRef<HTMLElement>(null)
    const contentRefs = useRef<(HTMLDivElement | null)[]>([])
    const [documentsOpen, setDocumentsOpen] = useState(false)

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
        <>
        <footer ref={footerRef} className={styles.footer}>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <div ref={el => { contentRefs.current[0] = el }} className={styles.columnContent}>
                        <h2 className={styles.heading}>{t('contact')}</h2>
                        {contacts ? (
                            <div>
                                <PortableText value={contacts}/>
                            </div>
                        ) : (
                            <a href={`mailto:${contactInfo.email}`} className={styles.link}>
                                {contactInfo.email}
                            </a>
                        )}
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
                        {info ? (
                            <div>
                                <PortableText value={info}/>
                            </div>
                        ) : (
                            <div>
                                <p>{contactInfo.address.street}</p>
                                <p>{contactInfo.address.city}</p>
                                <p className={styles.detail}>IČO: {contactInfo.ico}</p>
                            </div>
                        )}
                        {items && items.length > 0 && (
                            <button
                                className={styles.documentsButton}
                                onClick={() => setDocumentsOpen(true)}
                            >
                                {t('documents')}
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.column}>
                    <div ref={el => {
                        contentRefs.current[3] = el
                    }} className={styles.columnContent}>
                        <p className={styles.detail}>&copy; {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                        <p className={styles.detail}>{t('allRightsReserved')}</p>
                    </div>
                </div>
            </div>
        </footer>

        {items && items.length > 0 && (
            <Overlay isOpen={documentsOpen} handleClose={() => setDocumentsOpen(false)}>
                <h2 className={styles.documentsTitle}>{t('documents')}</h2>
                <ul className={styles.documentsList}>
                    {items.map(item => (
                        <li key={item._key} className={styles.documentItem}>
                            <a
                                href={`${item.url}?dl=${item.originalFilename || item.title}`}
                                download
                                className={styles.documentLink}
                            >
                                {item.title}{item.extension && `.${item.extension}`}
                                {' '}
                                {item.size && (
                                    <span className={styles.documentSize}>
                                        {'('}{formatFileSize(item.size)}{')'}
                                    </span>
                                )}
                            </a>

                        </li>
                    ))}
                </ul>
            </Overlay>
        )}
        </>
    )
}
