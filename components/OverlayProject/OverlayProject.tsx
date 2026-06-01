'use client'
import {FunctionComponent, useState} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import {Figure} from '@/components/Figure/Figure'
import {ImageObject, LinkText, SimpleBlockContent, SimpleBlockContentWithLists} from '@/sanity/sanity.types'
import styles from './OverlayProject.module.scss'

export interface OverlayProjectData {
    id?: string
    title: string | null | undefined
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

interface OverlayProjectProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly project: OverlayProjectData | null
    readonly fieldIconMap?: Record<string, string>
}

export const OverlayProject: FunctionComponent<OverlayProjectProps> = ({isOpen, handleClose, project, fieldIconMap = {}}) => {
    const t = useTranslations('OverlayProject')
    const [lastProject, setLastProject] = useState<OverlayProjectData | null>(project)

    if (project && project !== lastProject) {
        setLastProject(project)
    }

    const displayProject = project ?? lastProject

    const icons = displayProject?.fields
        ?.map(f => ({url: fieldIconMap[f._id], title: f.title}))
        .filter(item => Boolean(item.url)) ?? []

    const handleCopyLink = () => {
        if (typeof window === 'undefined') return
        navigator.clipboard?.writeText(window.location.href)
    }

    const linkButton = displayProject?.id ? (
        <button type="button" className={styles.linkButton} onClick={handleCopyLink} aria-label={t('copyLink')}>
            <img src="/link.svg" alt="" aria-hidden="true"/>
        </button>
    ) : null

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose} icons={icons} toolbarExtras={linkButton}>
            {displayProject && (
                <>
                    <h2 className={styles.title}>{displayProject.title}</h2>

                    <div className={styles.meta}>
                        {(displayProject.active === true || displayProject.date) && (
                            <div className={styles.dateGroup}>
                                {displayProject.active === true && (
                                    <span className={styles.badge}>{t('active')}</span>
                                )}
                                {displayProject.date && (
                                    <p className={styles.date}>{displayProject.date}</p>
                                )}
                            </div>
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
                        {displayProject.partners && displayProject.partners.length > 0 && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>{t('partners', {count: displayProject.partners.length})}:</span>
                                <span className={styles.metaValue}>
                                    {displayProject.partners.map((partner) => (
                                        partner.link && (
                                            <PortableText key={partner._key} value={partner.link}/>
                                        )
                                    ))}
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
