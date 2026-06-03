'use client'

import React, {FunctionComponent, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {PortableText} from 'next-sanity'
import {useTranslations} from 'next-intl'
import {SimpleBlockContent} from '@/sanity/sanity.types'
import styles from './CollapsibleBody.module.scss'

interface CollapsibleBodyProps {
    value: SimpleBlockContent
}

const LINE_CLAMP = 8

export const CollapsibleBody: FunctionComponent<CollapsibleBodyProps> = ({value}) => {
    const t = useTranslations('Sections')
    const [expanded, setExpanded] = useState(false)
    const [overflows, setOverflows] = useState(false)
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const collapsedHeightRef = useRef(0)
    const tweenRef = useRef<gsap.core.Tween | null>(null)
    const didMountRef = useRef(false)

    useLayoutEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        if (!outer || !inner) return

        const measure = () => {
            const full = inner.scrollHeight

            const s = inner.style
            const prevDisplay = s.display
            const prevOverflow = s.overflow
            const prevOrient = s.getPropertyValue('-webkit-box-orient')
            const prevClamp = s.getPropertyValue('-webkit-line-clamp')
            s.display = '-webkit-box'
            s.overflow = 'hidden'
            s.setProperty('-webkit-box-orient', 'vertical')
            s.setProperty('-webkit-line-clamp', String(LINE_CLAMP))
            const collapsed = inner.offsetHeight
            s.display = prevDisplay
            s.overflow = prevOverflow
            s.setProperty('-webkit-box-orient', prevOrient)
            s.setProperty('-webkit-line-clamp', prevClamp)

            const doesOverflow = full > collapsed + 1
            collapsedHeightRef.current = collapsed
            setOverflows(doesOverflow)

            if (tweenRef.current?.isActive()) return
            if (!doesOverflow) {
                outer.style.maxHeight = ''
            } else if (!didMountRef.current) {
                outer.style.maxHeight = `${collapsed}px`
            }
        }

        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(inner)
        return () => ro.disconnect()
    }, [value])

    useEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        if (!outer || !inner || !overflows) return

        if (!didMountRef.current) {
            didMountRef.current = true
            return
        }

        tweenRef.current?.kill()

        const startHeight = outer.getBoundingClientRect().height
        const endHeight = expanded ? inner.scrollHeight : collapsedHeightRef.current

        outer.style.maxHeight = `${startHeight}px`
        tweenRef.current = gsap.fromTo(
            outer,
            {maxHeight: startHeight},
            {
                maxHeight: endHeight,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete() {
                    if (expanded) outer.style.maxHeight = 'none'
                },
            },
        )
    }, [expanded, overflows])

    return (
        <div className={styles.wrap}>
            <div ref={outerRef} className={styles.content}>
                <div ref={innerRef}>
                    <PortableText value={value}/>
                </div>
            </div>
            {overflows && (
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                >
                    <span>{expanded ? t('showLess') : t('showMore')}</span>
                    <svg
                        className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>
            )}
        </div>
    )
}
