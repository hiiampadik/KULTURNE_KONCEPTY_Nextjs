'use client'

import React, {FunctionComponent, useState} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import {OverlayProject, OverlayProjectData} from '@/components/OverlayProject/OverlayProject'
import styles from './SectionReferences.module.scss'
import {ImageObject, LinkText, SimpleBlockContent} from '@/sanity/sanity.types'

interface ReferenceItem {
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

interface SectionReferencesProps {
    id: string
    references: ReferenceItem[] | null | undefined
}

export const SectionReferences: FunctionComponent<SectionReferencesProps> = ({id, references}) => {
    const t = useTranslations('Sections')
    const tRef = useTranslations('References')
    const [selectedRef, setSelectedRef] = useState<OverlayProjectData | null>(null)

    return (
        <>
            <SectionContainer id={id} color="red" title={t('references')} subtitle={tRef('subtitle')}>
                {references?.map((ref) => (
                    <article
                        key={ref._id}
                        className={styles.card}
                        onClick={() => setSelectedRef(ref)}
                    >
                        {ref.date && (
                            <p className={styles.date}>{ref.date}</p>
                        )}
                        <div className={styles.cardMain}>
                            <div className={styles.cover}>
                                {ref.cover?.asset ? (
                                    <Figure
                                        image={ref.cover}
                                        alt={ref.cover.altTextSk ?? ref.title ?? ''}
                                        sizes="88px"
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <div className={styles.coverPlaceholder}/>
                                )}
                            </div>
                            <h3 className={styles.cardTitle}>{ref.title}</h3>
                        </div>
                        {ref.subtitle && (
                            <div className={styles.description}>
                                <PortableText value={ref.subtitle}/>
                            </div>
                        )}
                    </article>
                ))}
            </SectionContainer>

            <OverlayProject
                isOpen={selectedRef !== null}
                handleClose={() => setSelectedRef(null)}
                project={selectedRef}
            />
        </>
    )
}
