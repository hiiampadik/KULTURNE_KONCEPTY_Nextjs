'use client'

import { FunctionComponent, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './GridTransition.module.scss'

const TILE_W = 100
const TILE_H = 150

export const GridTransition: FunctionComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let fills: HTMLDivElement[] = []
        let cols = 0
        let rows = 0

        const GRID_LINE_LIGHT = 'rgba(200, 200, 200, 1)'
        const GRID_LINE_DARK = 'rgba(50, 50, 50, 1)'
        const FILLS_DURATION = 0.45
        const STAGGER_AMOUNT = 0.5

        const buildTiles = () => {
            if (fills.length) gsap.killTweensOf(fills)

            cols = Math.ceil(window.innerWidth / TILE_W) + 1
            rows = Math.ceil(window.innerHeight / TILE_H) + 1

            container.innerHTML = ''
            container.style.gridTemplateColumns = `repeat(${cols}, ${TILE_W}px)`
            container.style.gridTemplateRows = `repeat(${rows}, ${TILE_H}px)`

            fills = []
            for (let i = 0; i < cols * rows; i++) {
                const cell = document.createElement('div')
                cell.className = styles.cell
                const fill = document.createElement('div')
                fill.className = styles.fill
                cell.appendChild(fill)
                container.appendChild(cell)
                fills.push(fill)
            }

            // On resize: match current theme immediately
            // On first load: theme isn't set yet → defaults to light (fills at 0,0 via CSS)
            const dark = document.documentElement.dataset.theme === 'dark'
            gsap.set(fills, { x: dark ? TILE_W : 0, y: dark ? TILE_H : 0 })
            gsap.set(container, { backgroundColor: dark ? GRID_LINE_DARK : GRID_LINE_LIGHT, visibility: 'visible' })
        }

        const handleTransition = (e: Event) => {
            const to = (e as CustomEvent<{ to: 'dark' | 'light' }>).detail.to
            if (!fills.length) return
            gsap.killTweensOf(fills)
            gsap.killTweensOf(container)

            const totalDuration = FILLS_DURATION + STAGGER_AMOUNT
            const totalDurationContainer = FILLS_DURATION + STAGGER_AMOUNT - 0.4

            if (to === 'dark') {
                document.documentElement.dataset.theme = 'dark'
                gsap.set(fills, { x: 0, y: 0 })
                gsap.to(fills, {
                    x: TILE_W,
                    y: TILE_H,
                    duration: FILLS_DURATION,
                    ease: 'power2.in',
                    stagger: {
                        amount: STAGGER_AMOUNT,
                        from: 'start',
                        grid: [rows, cols],
                    },
                })
                gsap.to(container, {
                    backgroundColor: GRID_LINE_DARK,
                    duration: totalDurationContainer,
                    ease: 'none',
                })
            } else {
                gsap.set(fills, { x: TILE_W, y: TILE_H })
                gsap.to(fills, {
                    x: 0,
                    y: 0,
                    duration: FILLS_DURATION,
                    ease: 'power2.out',
                    stagger: {
                        amount: STAGGER_AMOUNT,
                        from: 'end',
                        grid: [rows, cols],
                    },
                    onComplete: () => {
                        document.documentElement.dataset.theme = 'light'
                    },
                })
                gsap.to(container, {
                    backgroundColor: GRID_LINE_LIGHT,
                    duration: totalDurationContainer,
                    ease: 'none',
                })
            }
        }

        buildTiles()

        let resizeTimer: ReturnType<typeof setTimeout>
        const handleResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(buildTiles, 200)
        }

        window.addEventListener('theme-transition', handleTransition)
        window.addEventListener('resize', handleResize)

        return () => {
            clearTimeout(resizeTimer)
            window.removeEventListener('theme-transition', handleTransition)
            window.removeEventListener('resize', handleResize)
            gsap.killTweensOf(fills)
            gsap.killTweensOf(container)
        }
    }, [])

    return <div ref={containerRef} className={styles.container} />
}
