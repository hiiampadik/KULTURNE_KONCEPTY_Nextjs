import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import styles from './SectionFields.module.scss'
import {SimpleBlockContent} from '@/sanity/sanity.types'

interface FieldItem {
    _id: string
    title: string | null | undefined
    body: SimpleBlockContent | null | undefined
    icon?: { asset?: { url?: string } | null } | null
}

interface SectionFieldsProps {
    id: string
    fields: FieldItem[] | null | undefined
}

export const SectionFields: FunctionComponent<SectionFieldsProps> = ({id, fields}) => {
    const t = useTranslations('Sections')

    return (
        <SectionContainer id={id} color="swamp" title={t('fields')}>
            {fields?.map((field) => (
                <div key={field._id} className={styles.fieldItem}>
                    {field.icon?.asset?.url && (
                        <img src={field.icon.asset.url} alt="" className={styles.fieldIcon}/>
                    )}
                    <div className={styles.fieldContent}>
                        <h3 className={styles.fieldTitle}>{field.title}</h3>
                        {field.body && (
                            <div className={styles.fieldBody}>
                                <PortableText value={field.body}/>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </SectionContainer>
    )
}
