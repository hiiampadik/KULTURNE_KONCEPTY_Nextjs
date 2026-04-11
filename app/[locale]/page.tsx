import {getLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/client'
import {homepageQuery} from '@/sanity/queries'
import {StickerWall} from '@/components/StickerWall/StickerWall'
import {SectionWhoWeAre} from '@/components/SectionWhoWeAre/SectionWhoWeAre'
import {SectionFields} from '@/components/SectionFields/SectionFields'
import {SectionProjects} from '@/components/SectionProjects/SectionProjects'
import {SectionReferences} from '@/components/SectionReferences/SectionReferences'
import styles from './page.module.scss'

export default async function Home() {
    const locale = await getLocale()
    const data = await sanityFetch({query: homepageQuery, params: {locale}})

    return (
        <>
            <StickerWall/>
            <div className={styles.page}>
                <SectionWhoWeAre id="who-we-are" aboutUs={data?.aboutUs}/>
                <SectionFields id="fields" fields={data?.fields}/>
                <SectionProjects id="projects" projects={data?.projects}/>
                <SectionReferences id="references" references={data?.references}/>
            </div>
        </>
    )
}
