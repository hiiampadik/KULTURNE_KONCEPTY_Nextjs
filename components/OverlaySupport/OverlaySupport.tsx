'use client'
import {FunctionComponent} from 'react'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './OverlaySupport.module.scss'

interface OverlaySupportProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly support?: SimpleBlockContent
}

export const OverlaySupport: FunctionComponent<OverlaySupportProps> = ({isOpen, handleClose, support}) => {
    const t = useTranslations('OverlaySupport')

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose}>
            <h2 className={styles.title}>{t('title')}</h2>
            {support && (
                <div className={styles.body}>
                    <PortableText value={support}/>
                </div>
            )}
        </Overlay>
    )
}
