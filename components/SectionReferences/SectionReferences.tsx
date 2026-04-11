import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import {Figure} from '@/components/Figure/Figure'
import styles from './SectionReferences.module.scss'
import {ImageObject, SimpleBlockContent} from '@/sanity/sanity.types'

interface ReferenceItem {
    _id: string
    title: string | null | undefined
    date: string | null | undefined
    cover: ImageObject | null | undefined
    description: SimpleBlockContent | null | undefined
    fields: Array<{title: string | null | undefined}> | null | undefined
}

interface SectionReferencesProps {
    id: string
    references: ReferenceItem[] | null | undefined
}

export const SectionReferences: FunctionComponent<SectionReferencesProps> = ({id, references}) => {
    const t = useTranslations('Sections')
    const tRef = useTranslations('References')

    return (
        <SectionContainer id={id} color="red" title={t('references')} subtitle={tRef('subtitle')}>
            {references?.map((ref) => (
                <article key={ref._id} className={styles.card}>
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
                    {ref.description && (
                        <div className={styles.description}>
                            <PortableText value={ref.description}/>
                        </div>
                    )}
                </article>
            ))}
        </SectionContainer>
    )
}
