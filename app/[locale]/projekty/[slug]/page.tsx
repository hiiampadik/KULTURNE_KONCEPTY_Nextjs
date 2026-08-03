import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import {Link} from '@/localization/navigation'
import {ProjectDetail} from '@/components/ProjectDetail/ProjectDetail'
import {siteUrl} from '@/constants/site'
import {urlForImage} from '@/sanity/image'
import {
    getProjectBySlug,
    getProjectSlugMaps,
    portableTextToPlain,
    projectUrl,
} from '@/sanity/projects'
import styles from './page.module.scss'

export const dynamic = 'force-static'

type PageParams = {locale: string; slug: string}

// The parent `[locale]` layout generates the `locale` segment; here we only
// generate the `slug` segment for each project. Slugs are locale-independent.
export async function generateStaticParams() {
    const {list} = await getProjectSlugMaps()
    return list.map(({slug}) => ({slug}))
}

function ogImageUrl(cover: unknown): string | undefined {
    return cover && (cover as {asset?: unknown}).asset
        ? urlForImage(cover as Parameters<typeof urlForImage>[0])
              .width(1200)
              .height(630)
              .fit('crop')
              .auto('format')
              .url()
        : undefined
}

export async function generateMetadata({params}: {params: Promise<PageParams>}): Promise<Metadata> {
    const {locale, slug} = await params
    const project = await getProjectBySlug(locale, slug)
    if (!project) return {}

    const url = projectUrl(locale, slug)
    const title = project.title ?? 'Projekt'
    const description =
        portableTextToPlain(project.subtitle) || portableTextToPlain(project.description) || undefined
    const ogImage = ogImageUrl(project.cover)

    return {
        title,
        description,
        alternates: {canonical: url},
        openGraph: {
            title,
            description,
            url,
            type: 'article',
            images: ogImage ? [{url: ogImage, width: 1200, height: 630}] : undefined,
        },
        twitter: {
            card: ogImage ? 'summary_large_image' : 'summary',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    }
}

export default async function ProjectPage({params}: {params: Promise<PageParams>}) {
    const {locale, slug} = await params
    setRequestLocale(locale)

    const project = await getProjectBySlug(locale, slug)
    if (!project) notFound()

    const t = await getTranslations({locale, namespace: 'NotFound'})

    const fieldIconMap: Record<string, string> = {}
    for (const field of project.fields ?? []) {
        if (field._id && field.icon) fieldIconMap[field._id] = field.icon
    }

    const url = projectUrl(locale, slug)
    const description =
        portableTextToPlain(project.subtitle) || portableTextToPlain(project.description) || undefined
    const ogImage = ogImageUrl(project.cover)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title ?? undefined,
        description,
        url,
        image: ogImage,
        inLanguage: locale,
        isPartOf: {'@id': `${siteUrl}#website`},
        publisher: {'@id': `${siteUrl}#organization`},
        ...(project._updatedAt ? {dateModified: project._updatedAt} : {}),
    }

    return (
        <div className={styles.wrap}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <div className={styles.inner}>
                <div className={styles.backContainer}>
                <Link href="/" className={styles.back}>← {t('backHome')}</Link>
                </div>
                <article className={styles.page}>
                    <ProjectDetail
                        project={{...project, id: project._id}}
                        fieldIconMap={fieldIconMap}
                        showFields
                        titleAs="h1"
                    />
                </article>
            </div>
        </div>
    )
}
