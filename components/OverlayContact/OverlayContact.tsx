'use client'
import {FunctionComponent} from 'react'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import {socialLinks, contactInfo} from '@/constants/site'
import styles from './OverlayContact.module.scss'

interface OverlayContactProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
}

export const OverlayContact: FunctionComponent<OverlayContactProps> = ({isOpen, handleClose}) => {
    const t = useTranslations('OverlayContact')

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose}>
            <h2 className={styles.title}>{t('title')}</h2>

            <div className={styles.info}>
                <a href={`mailto:${contactInfo.email}`} className={styles.email}>
                    {contactInfo.email}
                </a>

                <div className={styles.address}>
                    <p>{contactInfo.address.street}</p>
                    <p>{contactInfo.address.city}</p>
                </div>

                <p className={styles.detail}>IČO: {contactInfo.ico}</p>
                <p className={styles.detail}>© {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                <p className={styles.detail}>{t('allRightsReserved')}</p>

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
