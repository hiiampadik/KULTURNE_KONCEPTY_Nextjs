'use client'
import {FunctionComponent, PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import styles from './index.module.scss'
import {classNames} from '@/components/utils/classNames'

interface OverlayProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly className?: string
    readonly iconUrls?: string[]
}

const MOBILE_BREAKPOINT = 991

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({isOpen, handleClose, children, className, iconUrls}) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const tweenRef = useRef<gsap.core.Timeline | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    const isMobile = useCallback(() => window.innerWidth <= MOBILE_BREAKPOINT, [])

    useEffect(() => {
        const html = document.documentElement
        const body = document.body

        tweenRef.current?.kill()

        if (isOpen) {
            setIsVisible(true)
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
            panelRef.current?.focus()

            const mobile = isMobile()
            const tl = gsap.timeline()
            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                onStart() {
                    if (backdropRef.current) backdropRef.current.style.pointerEvents = 'auto'
                },
            }, 0)
            tl.fromTo(panelRef.current, {
                x: mobile ? 0 : '100%',
                y: mobile ? '100%' : 0,
            }, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
            }, 0)
            tweenRef.current = tl
        } else {
            const mobile = isMobile()
            const tl = gsap.timeline({
                onComplete() {
                    html.style.overflow = ''
                    body.style.overflow = ''
                    setIsVisible(false)
                },
            })
            tl.to(backdropRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete() {
                    if (backdropRef.current) backdropRef.current.style.pointerEvents = 'none'
                },
            }, 0)
            tl.to(panelRef.current, {
                x: mobile ? 0 : '100%',
                y: mobile ? '100%' : 0,
                duration: 0.4,
                ease: 'power2.in',
            }, 0)
            tweenRef.current = tl
        }

        return () => {
            html.style.overflow = ''
            body.style.overflow = ''
        }
    }, [isOpen, isMobile])

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, handleClose])

    if (!isVisible && !isOpen) return null

    return (
        <>
            <div
                ref={backdropRef}
                className={styles.backdrop}
                onClick={handleClose}
                aria-hidden="true"
            />
            <div
                ref={panelRef}
                className={classNames([styles.panel, className])}
                role="dialog"
                aria-modal="true"
                aria-label="Panel"
                tabIndex={-1}
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
