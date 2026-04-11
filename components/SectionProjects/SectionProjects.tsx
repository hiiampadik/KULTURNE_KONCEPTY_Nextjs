import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import styles from './SectionProjects.module.scss'
import {ImageObject, SimpleBlockContent} from '@/sanity/sanity.types'

interface ProjectItem {
    _id: string
    title: string | null | undefined
    date: string | null | undefined
    cover: ImageObject | null | undefined
    subtitle: SimpleBlockContent | null | undefined
    fields: Array<{title: string | null | undefined}> | null | undefined
}

interface SectionProjectsProps {
    id: string
    projects: ProjectItem[] | null | undefined
}

export const SectionProjects: FunctionComponent<SectionProjectsProps> = ({id, projects}) => {
    return (
        <SectionContainer id={id} color="red" title="Odkúšané projekty">
            {projects?.map((project) => (
                <article key={project._id} className={styles.card}>
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
    )
}
