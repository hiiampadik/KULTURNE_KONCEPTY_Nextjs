import {getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/client'
import {homepageQuery} from '@/sanity/queries'
import {getProjectSlugMaps} from '@/sanity/projects'
import {StickerWall} from '@/components/StickerWall/StickerWall'
import {SectionWhoWeAre} from '@/components/SectionWhoWeAre/SectionWhoWeAre'
import {SectionFields} from '@/components/SectionFields/SectionFields'
import {SectionProjects} from '@/components/SectionProjects/SectionProjects'
import styles from './page.module.scss'

export default async function Home({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params
    setRequestLocale(locale)
    const data = await sanityFetch({query: homepageQuery, params: {locale}})
    const {idToSlug} = await getProjectSlugMaps()
    const t = await getTranslations({locale, namespace: 'Sections'})
    const tRef = await getTranslations({locale, namespace: 'References'})

    // Attach the (locale-independent) slug so cards link to their real detail page.
    const withSlug = (arr: any) =>
        (arr ?? []).map((item: any) => ({...item, slug: idToSlug.get(item._id)}))
    const projects = withSlug(data?.projects)
    const references = withSlug(data?.references)

    const fieldIconMap: Record<string, string> = {}
    for (const field of data?.fields ?? []) {
        if (field._id && field.icon?.asset?.url) {
            fieldIconMap[field._id] = field.icon.asset.url
        }
    }

    return (
        <>
            <StickerWall stickers={(data?.stickers ?? []).map((s: any) => s.asset?.url).filter(Boolean)}/>
            <div className={styles.wrap}>
                <div className={styles.page}>
                    <SectionWhoWeAre id="who-we-are" aboutUs={data?.aboutUs}/>
                    <SectionFields id="fields" fields={data?.fields}/>
                    <SectionProjects id="projects" title={t('projects')} items={projects} fieldIconMap={fieldIconMap}/>
                    <SectionProjects id="references" title={t('references')} subtitle={tRef('subtitle')} items={references} fieldIconMap={fieldIconMap}/>
                </div>
            </div>
        </>
    )
}
