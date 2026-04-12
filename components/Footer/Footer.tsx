'use client'
import {FunctionComponent} from 'react'
import {useTranslations} from 'next-intl'
import {socialLinks, contactInfo} from '@/constants/site'
import styles from './Footer.module.scss'

export const Footer: FunctionComponent = () => {
    const t = useTranslations('Footer')

    return (
        <footer className={styles.footer}>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <h2 className={styles.heading}>{t('contact')}</h2>
                    <a href={`mailto:${contactInfo.email}`} className={styles.link}>
                        {contactInfo.email}
                    </a>
                </div>

                <div className={styles.column}>
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

                <div className={styles.column}>
                    <div className={styles.address}>
                        <p>{contactInfo.address.street}</p>
                        <p>{contactInfo.address.city}</p>
                    </div>
                    <p className={styles.detail}>IČO: {contactInfo.ico}</p>
                </div>

                <div className={styles.column}>
                    <p className={styles.detail}>&copy; {contactInfo.copyrightYear} {contactInfo.companyName}</p>
                    <p className={styles.detail}>{t('allRightsReserved')}</p>
                </div>
            </div>
        </footer>
    )
}
