import {getLocale, getTranslations} from 'next-intl/server'
import {sanityFetch} from '@/sanity/client'
import {homepageQuery} from '@/sanity/queries'
import {StickerWall} from '@/components/StickerWall/StickerWall'
import {SectionWhoWeAre} from '@/components/SectionWhoWeAre/SectionWhoWeAre'
import {SectionFields} from '@/components/SectionFields/SectionFields'
import {SectionProjects} from '@/components/SectionProjects/SectionProjects'
import styles from './page.module.scss'

export default async function Home() {
    const locale = await getLocale()
    const data = await sanityFetch({query: homepageQuery, params: {locale}})
    const t = await getTranslations('Sections')
    const tRef = await getTranslations('References')

    return (
        <>
            <StickerWall/>
            <div className={styles.page}>
                <SectionWhoWeAre id="who-we-are" aboutUs={data?.aboutUs}/>
                <SectionFields id="fields" fields={data?.fields}/>
                <SectionProjects id="projects" title={t('projects')} items={data?.projects}/>
                <SectionProjects id="references" title={t('references')} subtitle={tRef('subtitle')} items={data?.references}/>
            </div>
        </>
    )
}
