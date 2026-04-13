'use client'
import {FunctionComponent, useRef} from 'react'
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
    const lastProjectRef = useRef<OverlayProjectData | null>(null)

    if (project) {
        lastProjectRef.current = project
    }

    const displayProject = project ?? lastProjectRef.current

    const iconUrls = displayProject?.fields
        ?.map(f => fieldIconMap[f._id])
        .filter(Boolean) ?? []

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose} iconUrls={iconUrls}>
            {displayProject && (
                <>
                    <h2 className={styles.title}>{displayProject.title}</h2>

                    <div className={styles.meta}>
                        {displayProject.active != null && (
                            <span className={styles.badge}>
                                {displayProject.active ? t('active') : t('completed')}
                            </span>
                        )}
                        {displayProject.date && (
                            <p className={styles.date}>{displayProject.date}</p>
                        )}
                        {displayProject.web && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>WEB:</span>
                                <span className={styles.metaValue}>
                                    <PortableText value={displayProject.web}/>
                                </span>
                            </div>
                        )}
                        {displayProject.location && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>{t('location')}:</span>
                                <span className={styles.metaValue}>
                                    <PortableText value={displayProject.location}/>
                                </span>
                            </div>
                        )}
                    </div>

                    {(displayProject.subtitle || displayProject.description) && (
                        <div className={styles.body}>
                            {displayProject.subtitle && (
                                <div className={styles.perex}>
                                    <PortableText value={displayProject.subtitle}/>
                                </div>
                            )}
                            {displayProject.description && (
                                <div className={styles.description}>
                                    <PortableText value={displayProject.description}/>
                                </div>
                            )}
                        </div>
                    )}

                    {displayProject.gallery && displayProject.gallery.length > 0 && (
                        <div className={styles.gallery}>
                            {displayProject.gallery.map((image) => (
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
