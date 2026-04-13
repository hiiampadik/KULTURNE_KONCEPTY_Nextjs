'use client'
import {FunctionComponent, PropsWithChildren, useEffect, useRef} from 'react'
import styles from './index.module.scss'
import {classNames} from '@/components/utils/classNames'

interface OverlayProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly className?: string
    readonly iconUrls?: string[]
}

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({isOpen, handleClose, children, className, iconUrls}) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        if (isOpen) {
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
            closeButtonRef.current?.focus()
        } else {
            html.style.overflow = ''
            body.style.overflow = ''
        }
        return () => {
            html.style.overflow = ''
            body.style.overflow = ''
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, handleClose])

    return (
        <>
            <div
                className={classNames([styles.backdrop, isOpen && styles.open])}
                onClick={handleClose}
                aria-hidden="true"
            />
            <div
                className={classNames([styles.panel, isOpen && styles.open, className])}
                role="dialog"
                aria-modal="true"
                aria-label="Panel"
                inert={!isOpen}
            >
                <div className={styles.toolbar}>
                    <button ref={closeButtonRef} className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <line x1="2" y1="2" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="28" y1="2" x2="2" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                    </button>
                    {iconUrls && iconUrls.length > 0 && (
                        <div className={styles.icons}>
                            {iconUrls.map(url => (
                                <img key={url} src={url} alt="" className={styles.icon}/>
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
