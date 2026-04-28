'use client'
import {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import {socialLinks, contactInfo} from '@/constants/site'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './OverlayContact.module.scss'

interface OverlayContactProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly contacts?: SimpleBlockContent
    readonly info?: SimpleBlockContent
}

export const OverlayContact: FunctionComponent<OverlayContactProps> = ({isOpen, handleClose, contacts, info}) => {
    const t = useTranslations('OverlayContact')

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose}>
            <h2 className={styles.title}>{t('title')}</h2>

            <div className={styles.info}>
                {contacts ? (
                    <div>
                        <PortableText value={contacts}/>
                    </div>
                ) : (
                    <>
                        <a href={`mailto:${contactInfo.email}`} className={styles.email}>
                            {contactInfo.email}
                        </a>
                    </>
                )}

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

                <div>
                    <p>© {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                    <p>{t('allRightsReserved')}</p>
                </div>

                <div className={styles.social}>
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <img src="/fb.svg" alt="Facebook" className={styles.socialIcon}/>
                    </a>
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <img src="/ig.svg" alt="Instagram" className={styles.socialIcon}/>
                    </a>
                </div>
            </div>

            {/* TODO: Galéria */}
        </Overlay>
    )
}
