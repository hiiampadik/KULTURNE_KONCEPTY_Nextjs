import type {MetadataRoute} from 'next'
import {siteUrl} from '@/constants/site'

export const dynamic = 'force-static'

const BASE_URL_NO_SLASH = siteUrl.replace(/\/+$/, '')

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${BASE_URL_NO_SLASH}/sitemap.xml`,
        host: BASE_URL_NO_SLASH,
    }
}
