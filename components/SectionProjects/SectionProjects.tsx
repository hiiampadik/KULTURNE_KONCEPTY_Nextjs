'use client'

import React, {FunctionComponent, useState} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import {OverlayProject, OverlayProjectData} from '@/components/OverlayProject/OverlayProject'
import styles from './SectionProjects.module.scss'
import {ImageObject, LinkText, SimpleBlockContent} from '@/sanity/sanity.types'

interface ProjectItem {
    _id: string
    active?: boolean | null
    title: string | null | undefined
    date: string | null | undefined
    cover: ImageObject | null | undefined
    subtitle: SimpleBlockContent | null | undefined
    description: SimpleBlockContent | null | undefined
    web: LinkText | null | undefined
    location: LinkText | null | undefined
    gallery: Array<{_key: string} & ImageObject> | null | undefined
    fields: Array<{title: string | null | undefined}> | null | undefined
}

interface SectionProjectsProps {
    id: string
    projects: ProjectItem[] | null | undefined
}

export const SectionProjects: FunctionComponent<SectionProjectsProps> = ({id, projects}) => {
    const t = useTranslations('Sections')
    const [selectedProject, setSelectedProject] = useState<OverlayProjectData | null>(null)

    return (
        <>
            <SectionContainer id={id} color="red" title={t('projects')}>
                {projects?.map((project) => (
                    <article
                        key={project._id}
                        className={styles.card}
                        onClick={() => setSelectedProject(project)}
                    >
                        {project.date && (
                            <p className={styles.date}>{project.date}</p>
                        )}
                        <div className={styles.cardMain}>
                            <div className={styles.cover}>
                                {project.cover?.asset ? (
                                    <Figure
                                        image={project.cover}
                                        alt={project.cover.altTextSk ?? project.title ?? ''}
                                        sizes="88px"
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <div className={styles.coverPlaceholder}/>
                                )}
                            </div>
                            <h3 className={styles.cardTitle}>{project.title}</h3>
                        </div>
                        {project.subtitle && (
                            <div className={styles.description}>
                                <PortableText value={project.subtitle}/>
                            </div>
                        )}
                    </article>
                ))}
            </SectionContainer>

            <OverlayProject
                isOpen={selectedProject !== null}
                handleClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </>
    )
}
