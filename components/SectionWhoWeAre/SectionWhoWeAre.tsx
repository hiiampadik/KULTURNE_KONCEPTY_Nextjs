import React, {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {SectionContainer} from '@/components/SectionContainer/SectionContainer'
import styles from './SectionWhoWeAre.module.scss'
import {BlockContentWithHeadings} from '@/sanity/sanity.types'

interface SectionWhoWeAreProps {
    id: string
    aboutUs: BlockContentWithHeadings | null | undefined
}

export const SectionWhoWeAre: FunctionComponent<SectionWhoWeAreProps> = ({id, aboutUs}) => {
    return (
        <SectionContainer id={id} color="blue" title="Kdo sme?" className={styles.section}>
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
