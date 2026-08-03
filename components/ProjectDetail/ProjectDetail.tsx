'use client'
import {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {Figure} from '@/components/Figure/Figure'
import {ImageObject, LinkText, SimpleBlockContent, SimpleBlockContentWithLists} from '@/sanity/sanity.types'
import styles from './ProjectDetail.module.scss'

export interface ProjectDetailData {
    id?: string
    title?: string | null
    active?: boolean | null
    date?: string | null
    web?: LinkText | null
    location?: LinkText | null
    subtitle?: SimpleBlockContent | null
    description?: SimpleBlockContentWithLists | null
    partners?: Array<{_key: string; link: LinkText | null | undefined}> | null
    gallery?: Array<{_key: string} & ImageObject> | null
    fields?: Array<{_id: string; title: string | null | undefined}> | null
}

interface ProjectDetailProps {
    readonly project: ProjectDetailData
    readonly fieldIconMap?: Record<string, string>
    /** Render the field icons inline (used on the standalone page; the modal shows them in its toolbar). */
    readonly showFields?: boolean
    /** Heading level for the project title. Modal uses `h2`, the standalone page uses `h1`. */
    readonly titleAs?: 'h1' | 'h2'
}

/**
 * Presentational project content shared by the modal (OverlayProject) and the
 * standalone detail page. Keeps a single source of truth for the markup so both
 * views stay in sync.
 */
export const ProjectDetail: FunctionComponent<ProjectDetailProps> = ({
    project,
    fieldIconMap = {},
    showFields = false,
    titleAs = 'h2',
}) => {
    const t = useTranslations('OverlayProject')
    const Title = titleAs

    const icons = project.fields
        ?.map(f => ({url: fieldIconMap[f._id], title: f.title}))
        .filter(item => Boolean(item.url)) ?? []

    return (
        <>
            <Title className={styles.title}>{project.title}</Title>

            {showFields && icons.length > 0 && (
                <div className={styles.fields}>
                    {icons.map(({url, title}) => (
                        <img key={url} src={url} alt={title ?? ''} className={styles.fieldIcon}/>
                    ))}
                </div>
            )}

            <div className={styles.meta}>
                {(project.active === true || project.date) && (
                    <div className={styles.dateGroup}>
                        {project.active === true && (
                            <span className={styles.badge}>{t('active')}</span>
                        )}
                        {project.date && (
                            <p className={styles.date}>{project.date}</p>
                        )}
                    </div>
                )}
                {project.web && (
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>WEB:</span>
                        <span className={styles.metaValue}>
                            <PortableText value={project.web}/>
                        </span>
                    </div>
                )}
                {project.location && (
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>{t('location')}:</span>
                        <span className={styles.metaValue}>
                            <PortableText value={project.location}/>
                        </span>
                    </div>
                )}
                {project.partners && project.partners.length > 0 && (
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>{t('partners', {count: project.partners.length})}:</span>
                        <span className={styles.metaValue}>
                            {project.partners.map((partner) => (
                                partner.link && (
                                    <PortableText key={partner._key} value={partner.link}/>
                                )
                            ))}
                        </span>
                    </div>
                )}
            </div>

            {(project.subtitle || project.description) && (
                <div className={styles.body}>
                    {project.subtitle && (
                        <div className={styles.perex}>
                            <PortableText value={project.subtitle}/>
                        </div>
                    )}
                    {project.description && (
                        <div className={styles.description}>
                            <PortableText value={project.description}/>
                        </div>
                    )}
                </div>
            )}

            {project.gallery && project.gallery.length > 0 && (
                <div className={styles.gallery}>
                    {project.gallery.map((image) => (
                        image.asset && (
                            <Figure
                                key={image._key}
                                image={image}
                                alt={image.altTextSk ?? ''}
                                sizes="400px"
                                className={styles.galleryImage}
                            />
                        )
                    ))}
                </div>
            )}
        </>
    )
}
