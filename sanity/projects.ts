import {groq} from 'next-sanity'
import {sanityFetch} from './client'
import {routing} from '@/localization/routing'
import {siteUrl} from '@/constants/site'
import type {
    ImageObject,
    LinkText,
    SimpleBlockContent,
    SimpleBlockContentWithLists,
} from './sanity.types'

// URL segment used for per-project detail pages: /<locale>/projekty/<slug>
export const PROJECT_SEGMENT = 'projekty'

const BASE_URL_NO_SLASH = siteUrl.replace(/\/+$/, '')

/** Locale-prefixed path (e.g. `/sk/projekty/moj-projekt`). */
export function projectPath(locale: string, slug: string): string {
    return `/${locale}/${PROJECT_SEGMENT}/${slug}`
}

/** Absolute canonical URL for a project detail page. */
export function projectUrl(locale: string, slug: string): string {
    return `${BASE_URL_NO_SLASH}${projectPath(locale, slug)}`
}

// ---------------------------------------------------------------------------
// Slugs
//
// The Sanity `project` schema has NO slug field (the Studio lives in a separate
// project), so slugs are derived deterministically from the default-locale
// title at build time. Order is stabilised by `_id` so collision suffixes stay
// consistent across builds.
// ---------------------------------------------------------------------------

export function slugify(input: string): string {
    return input
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip diacritics (á → a, č → c, …)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export interface ProjectSlugSource {
    _id: string
    _updatedAt?: string | null
    title?: string | null
    cover?: string | null // asset URL
}

export interface ProjectSlugEntry {
    _id: string
    slug: string
    updatedAt?: string | null
    cover?: string | null
}

export interface ProjectSlugMaps {
    idToSlug: Map<string, string>
    slugToId: Map<string, string>
    list: ProjectSlugEntry[]
}

export function buildProjectSlugMaps(projects: ProjectSlugSource[]): ProjectSlugMaps {
    const idToSlug = new Map<string, string>()
    const slugToId = new Map<string, string>()
    const list: ProjectSlugEntry[] = []
    const used = new Map<string, number>()

    // Deterministic order → stable collision suffixes across builds.
    const ordered = [...projects].sort((a, b) => a._id.localeCompare(b._id))

    for (const project of ordered) {
        const base = slugify(project.title ?? '') || slugify(project._id) || project._id
        const count = used.get(base) ?? 0
        const slug = count === 0 ? base : `${base}-${count + 1}`
        used.set(base, count + 1)

        idToSlug.set(project._id, slug)
        slugToId.set(slug, project._id)
        list.push({
            _id: project._id,
            slug,
            updatedAt: project._updatedAt ?? null,
            cover: project.cover ?? null,
        })
    }

    return {idToSlug, slugToId, list}
}

// Projects actually shown on the homepage (curated `projects` + `references`
// arrays), so every clickable card maps to a real page and there are no orphan
// detail pages for unreferenced documents.
export const projectIndexQuery = groq`*[_type == "homepage"][0]{
  "projects": projects[]->{
    _id,
    _updatedAt,
    "title": title[language == $locale][0].value,
    "cover": cover.asset->url
  },
  "references": references[]->{
    _id,
    _updatedAt,
    "title": title[language == $locale][0].value,
    "cover": cover.asset->url
  }
}`

export async function getProjectSlugMaps(): Promise<ProjectSlugMaps> {
    const data = (await sanityFetch({
        query: projectIndexQuery,
        params: {locale: routing.defaultLocale},
    })) as {projects?: ProjectSlugSource[]; references?: ProjectSlugSource[]} | null

    const seen = new Map<string, ProjectSlugSource>()
    for (const item of [...(data?.projects ?? []), ...(data?.references ?? [])]) {
        if (item?._id && !seen.has(item._id)) seen.set(item._id, item)
    }
    return buildProjectSlugMaps([...seen.values()])
}

// ---------------------------------------------------------------------------
// Detail page data
// ---------------------------------------------------------------------------

export const projectByIdQuery = groq`*[_type == "project" && _id == $id][0]{
  _id,
  _updatedAt,
  active,
  "title": title[language == $locale][0].value,
  "date": date[language == $locale][0].value,
  cover,
  "subtitle": subtitle[language == $locale][0].value,
  "description": description[language == $locale][0].value,
  "web": web[language == $locale][0].value,
  "location": location[language == $locale][0].value,
  partners[] {
    _key,
    "link": link[language == $locale][0].value
  },
  gallery,
  "fields": fields[]->{ _id, "title": title[language == $locale][0].value, "icon": icon.asset->url }
}`

export interface ProjectDetailResult {
    _id: string
    _updatedAt?: string
    active?: boolean | null
    title?: string | null
    date?: string | null
    cover?: ImageObject | null
    subtitle?: SimpleBlockContent | null
    description?: SimpleBlockContentWithLists | null
    web?: LinkText | null
    location?: LinkText | null
    partners?: Array<{_key: string; link: LinkText | null | undefined}> | null
    gallery?: Array<{_key: string} & ImageObject> | null
    fields?: Array<{_id: string; title: string | null | undefined; icon?: string | null}> | null
}

export async function getProjectBySlug(
    locale: string,
    slug: string,
): Promise<ProjectDetailResult | null> {
    const {slugToId} = await getProjectSlugMaps()
    const id = slugToId.get(slug)
    if (!id) return null
    return (await sanityFetch({
        query: projectByIdQuery,
        params: {locale, id},
    })) as ProjectDetailResult | null
}

// Flatten Portable Text to plain text for meta descriptions / OG tags.
type PortableTextBlock = {_type?: string; children?: Array<{text?: string}>}

export function portableTextToPlain(value: unknown, maxLength = 200): string {
    if (!Array.isArray(value)) return ''
    const text = (value as PortableTextBlock[])
        .filter(block => block?._type === 'block' && Array.isArray(block.children))
        .map(block => (block.children ?? []).map(child => child.text ?? '').join(''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
