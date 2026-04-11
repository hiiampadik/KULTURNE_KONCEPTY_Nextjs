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
                    <h3 className={styles.heading}>{t('contact')}</h3>
                    <a href={`mailto:${contactInfo.email}`} className={styles.link}>
                        {contactInfo.email}
                    </a>
                </div>

                <div className={styles.column}>
                    <h3 className={styles.heading}>{t('followUs')}</h3>
                    <div className={styles.social}>
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/>
                            </svg>
                        </a>
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                            </svg>
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
