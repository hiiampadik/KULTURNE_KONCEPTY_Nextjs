'use client'
import {FunctionComponent, PropsWithChildren, useEffect} from 'react'
import styles from './index.module.scss'
import {classNames} from '@/components/utils/classNames'

export type OverlayIcon = 'architecture' | 'culture' | 'urbanism' | 'design' // TODO: přiřadit SVG ikonám

interface OverlayProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly className?: string
    readonly icons?: OverlayIcon[]
}

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({isOpen, handleClose, children, className, icons}) => {
    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        if (isOpen) {
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
        } else {
            html.style.overflow = ''
            body.style.overflow = ''
        }
        return () => {
            html.style.overflow = ''
            body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <>
            <div
                className={classNames([styles.backdrop, isOpen && styles.open])}
                onClick={handleClose}
            />
            <div className={classNames([styles.panel, isOpen && styles.open, className])}>
                <div className={styles.toolbar}>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="2" y1="2" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="28" y1="2" x2="2" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                    </button>
                    {icons && icons.length > 0 && (
                        <div className={styles.icons}>
                            {/* TODO: nahradit skutečnými SVG ikonami */}
                            {icons.map(icon => (
                                <span key={icon} className={styles.icon} data-icon={icon}/>
                            ))}
                        </div>
                    )}
                </div>
                <div className={classNames([styles.content, className])}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Overlay
