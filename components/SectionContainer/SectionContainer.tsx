import React, {FunctionComponent} from 'react'
import {DogEar} from '@/components/DogEar/DogEar'
import {classNames} from '@/components/utils/classNames'
import styles from './SectionContainer.module.scss'

export type SectionColor = 'blue' | 'swamp' | 'red'

interface SectionContainerProps {
    id: string
    color: SectionColor
    title: string
    subtitle?: React.ReactNode
    children: React.ReactNode
    className?: string
}

export const SectionContainer: FunctionComponent<SectionContainerProps> = ({
    id,
    color,
    title,
    subtitle,
    children,
    className,
}) => {
    return (
        <section id={id} className={classNames([styles.section, className])}>
            <DogEar corner="top-right" className={styles.header}>
                <div className={styles.headerContent} data-color={color}>
                    <h2 className={styles.title}>
                        {title}
                    </h2>
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
            </DogEar>
            <div className={styles.body}>
                {children}
            </div>
        </section>
    )
}
