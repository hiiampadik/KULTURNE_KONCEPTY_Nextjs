'use client'
import {FunctionComponent, useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import type {SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './OverlaySupport.module.scss'

interface OverlaySupportProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly support?: SimpleBlockContent
}

export const OverlaySupport: FunctionComponent<OverlaySupportProps> = ({isOpen, handleClose, support}) => {
    const t = useTranslations('OverlaySupport')
    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const tweenRef = useRef<gsap.core.Timeline | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const html = document.documentElement
        const body = document.body

        tweenRef.current?.kill()

        if (isOpen) {
            setIsVisible(true)
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
            panelRef.current?.focus()

            const tl = gsap.timeline()
            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.1,
                ease: 'power2.out',
                onStart() {
                    if (backdropRef.current) backdropRef.current.style.pointerEvents = 'auto'
                },
            }, 0)
            tl.fromTo(panelRef.current, {
                opacity: 0,
                scale: 0.8,
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'back.out(3)',
            }, 0)
            tweenRef.current = tl
        } else {
            const tl = gsap.timeline({
                onComplete() {
                    html.style.overflow = ''
                    body.style.overflow = ''
                    setIsVisible(false)
                },
            })
            tl.to(backdropRef.current, {
                opacity: 0,
                duration: 0.15,
                ease: 'power2.in',
                onComplete() {
                    if (backdropRef.current) backdropRef.current.style.pointerEvents = 'none'
                },
            }, 0)
            tl.to(panelRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: 'back.in(3)',
            }, 0)
            tweenRef.current = tl
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

    if (!isVisible && !isOpen) return null

    return (
        <>
            <div
                ref={backdropRef}
                className={styles.backdrop}
                onClick={handleClose}
                aria-hidden="true"
            />
            <div className={styles.wrapper}>
                <div
                    ref={panelRef}
                    className={styles.panel}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="overlay-support-title"
                    tabIndex={-1}
                    inert={!isOpen}
                >
                    <button className={styles.closeButton} onClick={handleClose} aria-label={t('close')}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <line x1="2" y1="2" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="28" y1="2" x2="2" y2="28" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                    </button>
                    <h2 id="overlay-support-title" className={styles.title}>{t('title')}</h2>
                    {support && (
                        <div className={styles.body}>
                            <PortableText value={support}/>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
