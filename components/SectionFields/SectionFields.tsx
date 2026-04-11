import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import styles from './SectionFields.module.scss'
import {SimpleBlockContent} from '@/sanity/sanity.types'

interface FieldItem {
    _id: string
    title: string | null | undefined
    body: SimpleBlockContent | null | undefined
}

interface SectionFieldsProps {
    id: string
    fields: FieldItem[] | null | undefined
}

export const SectionFields: FunctionComponent<SectionFieldsProps> = ({id, fields}) => {
    return (
        <SectionContainer id={id} color="swamp" title="Oblasti">
            {fields?.map((field) => (
                <div key={field._id} className={styles.fieldItem}>
                    <h3 className={styles.fieldTitle}>{field.title}</h3>
                    {field.body && (
                        <div className={styles.fieldBody}>
                            <PortableText value={field.body}/>
                        </div>
                    )}
                </div>
            ))}
        </SectionContainer>
    )
}
