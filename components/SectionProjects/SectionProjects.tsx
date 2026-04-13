'use client'

import React, {FunctionComponent, useState} from 'react'
import {PortableText} from 'next-sanity'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import {OverlayProject, OverlayProjectData} from '@/components/OverlayProject/OverlayProject'
import {DogEar} from '@/components/DogEar/DogEar'
import styles from './SectionProjects.module.scss'
import {ImageObject, LinkText, SimpleBlockContent} from '@/sanity/sanity.types'
import {classNames} from '@/components/utils/classNames';

export interface ProjectItem {
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
    title: string
    subtitle?: string
    items: ProjectItem[] | null | undefined
}

export const SectionProjects: FunctionComponent<SectionProjectsProps> = ({id, title, subtitle, items}) => {
    const [selected, setSelected] = useState<OverlayProjectData | null>(null)

    return (
        <>
            <SectionContainer id={id} color="red" title={title} subtitle={subtitle}>
                {items?.map((item, index) => (
                    <DogEar key={item._id} corner="bottom-left" size={0} hoverSize={45} shadow bgTriangle>
                        <button
                            type="button"
                            className={classNames([styles.card, index === 0 && styles.firstCard])}
                            onClick={() => setSelected(item)}
                        >
                            {item.date && (
                                <p className={styles.date}>{item.date}</p>
                            )}
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
                                    <PortableText value={item.subtitle}/>
                                </div>
                            )}
                        </button>
                    </DogEar>
                ))}
            </SectionContainer>

            <OverlayProject
                isOpen={selected !== null}
                handleClose={() => setSelected(null)}
                project={selected}
            />
        </>
    )
}
