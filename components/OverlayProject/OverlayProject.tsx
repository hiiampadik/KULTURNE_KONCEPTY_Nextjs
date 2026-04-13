'use client'
import {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import {Figure} from '@/components/Figure/Figure'
import {ImageObject, LinkText, SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './OverlayProject.module.scss'

export interface OverlayProjectData {
    title: string | null | undefined
    active?: boolean | null
    date?: string | null
    web?: LinkText | null
    location?: LinkText | null
    subtitle?: SimpleBlockContent | null
    description?: SimpleBlockContent | null
    gallery?: Array<{_key: string} & ImageObject> | null
    fields?: Array<{_id: string; title: string | null | undefined}> | null
}

interface OverlayProjectProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly project: OverlayProjectData | null
    readonly fieldIconMap?: Record<string, string>
}

export const OverlayProject: FunctionComponent<OverlayProjectProps> = ({isOpen, handleClose, project, fieldIconMap = {}}) => {
    const t = useTranslations('OverlayProject')

    const iconUrls = project?.fields
        ?.map(f => fieldIconMap[f._id])
        .filter(Boolean) ?? []

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose} iconUrls={iconUrls}>
            {project && (
                <>
                    <h2 className={styles.title}>{project.title}</h2>

                    <div className={styles.meta}>
                        {project.active != null && (
                            <span className={styles.badge}>
                                {project.active ? t('active') : t('completed')}
                            </span>
                        )}
                        {project.date && (
                            <p className={styles.date}>{project.date}</p>
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
            )}
        </Overlay>
    )
}
