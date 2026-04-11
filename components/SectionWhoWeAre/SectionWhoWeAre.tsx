import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import styles from './SectionWhoWeAre.module.scss'
import {BlockContentWithHeadings} from '@/sanity/sanity.types'

interface SectionWhoWeAreProps {
    id: string
    aboutUs: BlockContentWithHeadings | null | undefined
}

export const SectionWhoWeAre: FunctionComponent<SectionWhoWeAreProps> = ({id, aboutUs}) => {
    const t = useTranslations('Sections')

    return (
        <SectionContainer id={id} color="blue" title={t('whoWeAre')} className={styles.section}>
            <div className={styles.body}>
                {aboutUs && (
                    <div className={styles.content}>
                        <PortableText value={aboutUs}/>
                    </div>
                )}
            </div>
        </SectionContainer>
    )
}
