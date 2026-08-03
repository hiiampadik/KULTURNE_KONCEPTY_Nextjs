import type {MetadataRoute} from 'next'
import {routing} from '@/localization/routing'
import {siteUrl} from '@/constants/site'
import {getProjectSlugMaps, projectUrl} from '@/sanity/projects'

export const dynamic = 'force-static'

const BASE_URL_NO_SLASH = siteUrl.replace(/\/+$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const {list} = await getProjectSlugMaps()
    const entries: MetadataRoute.Sitemap = []

    // Home page (one entry per active locale).
    for (const locale of routing.locales) {
        entries.push({
            url: `${BASE_URL_NO_SLASH}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        })
    }

    // Project detail pages.
    for (const locale of routing.locales) {
        for (const project of list) {
            entries.push({
                url: projectUrl(locale, project.slug),
                lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
                changeFrequency: 'monthly',
                priority: 0.8,
                ...(project.cover ? {images: [project.cover]} : {}),
            })
        }
    }

    return entries
}
