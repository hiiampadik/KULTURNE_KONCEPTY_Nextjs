'use client'

import React, {FunctionComponent, useEffect, useState} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations, useLocale} from 'next-intl'
import {Link} from '@/localization/navigation'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import {OverlayProject, OverlayProjectData} from '@/components/OverlayProject/OverlayProject'
import {DogEar} from '@/components/DogEar/DogEar'
import styles from './SectionProjects.module.scss'
import {ImageObject, LinkText, SimpleBlockContent, SimpleBlockContentWithLists} from '@/sanity/sanity.types'
import {PROJECT_SEGMENT, projectPath} from '@/sanity/projects'
import {classNames} from '@/components/utils/classNames';

export interface ProjectItem {
    _id: string
    slug?: string
    active?: boolean | null
    title: string | null | undefined
    date: string | null | undefined
    cover: ImageObject | null | undefined
    subtitle: SimpleBlockContent | null | undefined
    description: SimpleBlockContentWithLists | null | undefined
    web: LinkText | null | undefined
    location: LinkText | null | undefined
    partners: Array<{_key: string; link: LinkText | null | undefined}> | null | undefined
    gallery: Array<{_key: string} & ImageObject> | null | undefined
    fields: Array<{_id: string; title: string | null | undefined}> | null | undefined
}

interface SectionProjectsProps {
    id: string
    title: string
    subtitle?: string
    items: ProjectItem[] | null | undefined
    fieldIconMap?: Record<string, string>
}

const PROJECT_PARAM = 'project'

// Card subtitles are wrapped in an <a> (the card link); render Portable Text
// link marks as plain text so we never nest an <a> inside an <a>.
const cardTextComponents = {
    marks: {
        link: ({children}: {children?: React.ReactNode}) => <>{children}</>,
    },
}

export const SectionProjects: FunctionComponent<SectionProjectsProps> = ({id, title, subtitle, items, fieldIconMap = {}}) => {
    const t = useTranslations('OverlayProject')
    const locale = useLocale()
    const [selected, setSelected] = useState<OverlayProjectData | null>(null)

    const replaceUrl = (path: string) => {
        window.history.replaceState(null, '', path)
    }

    const openProject = (item: ProjectItem) => {
        setSelected({...item, id: item._id})
        if (item.slug) replaceUrl(projectPath(locale, item.slug))
    }

    const closeProject = () => {
        setSelected(null)
        replaceUrl(`/${locale}`)
    }

    // Intercept a plain left-click to open the modal; let modified/middle
    // clicks fall through so the real detail page opens (new tab, etc.).
    const handleCardClick = (item: ProjectItem) => (e: React.MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        openProject(item)
    }

    // Backward compatibility: legacy deep links use `?project=<sanity _id>`.
    useEffect(() => {
        if (!items) return
        const params = new URLSearchParams(window.location.search)
        const projectId = params.get(PROJECT_PARAM)
        if (!projectId) return
        const found = items.find(item => item._id === projectId)
        if (found) setSelected({...found, id: found._id})
    }, [items])

    return (
        <>
            <SectionContainer id={id} color="red" title={title} subtitle={subtitle}>
                {items?.map((item, index) => {
                    const icons = item.fields
                        ?.map(f => fieldIconMap[f._id])
                        .filter(Boolean) ?? []

                    return (
                        <DogEar key={item._id} corner="bottom-left" size={0} hoverSize={45} shadow bgTriangle>
                            <Link
                                href={item.slug ? `/${PROJECT_SEGMENT}/${item.slug}` : `/${PROJECT_SEGMENT}`}
                                className={classNames([styles.card, index === 0 && styles.firstCard])}
                                onClick={handleCardClick(item)}
                            >
                                <div className={styles.cardHeader}>
                                    {(item.active === true || item.date) && (
                                        <div className={styles.dateGroup}>
                                            {item.active === true && (
                                                <span className={styles.badge}>{t('active')}</span>
                                            )}
                                            {item.date && (
                                                <p className={styles.date}>{item.date}</p>
                                            )}
                                        </div>
                                    )}
                                    {icons.length > 0 && (
                                        <div className={styles.fieldIcons}>
                                            {icons.map(url => (
                                                <img key={url} src={url} alt="" className={styles.fieldIcon}/>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardMain}>
                                    <div className={styles.cover}>
                                        {item.cover?.asset ? (
                                            <Figure
                                                image={item.cover}
                                                alt={item.cover.altTextSk ?? item.title ?? ''}
                                                sizes="108px"
                                                className={styles.coverImage}
                                            />
                                        ) : (
                                            <div className={styles.coverPlaceholder}/>
                                        )}
                                    </div>
                                    <h2 className={styles.cardTitle}>{item.title}</h2>
                                </div>
                                {item.subtitle && (
                                    <div className={styles.description}>
                                        <PortableText value={item.subtitle} components={cardTextComponents}/>
                                    </div>
                                )}
                            </Link>
                        </DogEar>
                    )
                })}
            </SectionContainer>

            <OverlayProject
                isOpen={selected !== null}
                handleClose={closeProject}
                project={selected}
                fieldIconMap={fieldIconMap}
            />
        </>
    )
}
