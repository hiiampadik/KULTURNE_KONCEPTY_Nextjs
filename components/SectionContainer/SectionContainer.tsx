'use client'
import React, {FunctionComponent, useEffect, useRef} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {DogEar} from '@/components/DogEar/DogEar'
import {classNames} from '@/components/utils/classNames'
import {useDogEarSync} from '@/contexts/DogEarSync'
import styles from './SectionContainer.module.scss'

gsap.registerPlugin(ScrollTrigger)

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
    const {hoveredSection, setHoveredSection} = useDogEarSync()
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        const section = sectionRef.current
        if (!el || !section) return

        const innerShadowEl = el.firstElementChild

        gsap.set(el, {
            visibility: 'visible',
            yPercent: 100,
            clipPath: 'inset(100% 0 0 0)',
            filter: 'drop-shadow(0 0 0px rgba(0, 0, 0, 0))',
        })

        if (innerShadowEl) gsap.set(innerShadowEl, {filter: 'none'})

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                once: true,
            },
        })

        tl.to(el, {
            yPercent: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.6,
            ease: 'power3.out',
            onComplete: () => {
                gsap.set(el, {clearProps: 'clipPath'})
            },
        })

        tl.to(el, {
            filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.15))',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
                gsap.set(el, {clearProps: 'filter'})
                if (innerShadowEl) gsap.set(innerShadowEl, {clearProps: 'filter'})
            },
        })

        return () => {
            tl.kill()
        }
    }, [])

    return (
        <section ref={sectionRef} id={id} className={classNames([styles.section, className])}>
            <div ref={headerRef} className={styles.headerReveal}>
                <DogEar corner="top-right" className={styles.header}
                    forceHover={hoveredSection === id}
                    onMouseEnter={() => setHoveredSection(id)}
                    onMouseLeave={() => setHoveredSection(null)}>
                    <div className={styles.headerContent} data-color={color}>
                        <h2 className={styles.title}>
                            {title}
                        </h2>
                        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                    </div>
                </DogEar>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </section>
    )
}
