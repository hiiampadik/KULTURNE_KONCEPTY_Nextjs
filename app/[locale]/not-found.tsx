import {getTranslations} from 'next-intl/server'
import {Link} from '@/localization/navigation'
import styles from './not-found.module.scss'

export default async function NotFound() {
    const t = await getTranslations('NotFound')

    return (
        <div className={styles.wrap}>
            <div className={styles.page}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.description}>{t('description')}</p>
                <Link href="/" className={styles.link}>{t('backHome')}</Link>
            </div>
        </div>
    )
}
