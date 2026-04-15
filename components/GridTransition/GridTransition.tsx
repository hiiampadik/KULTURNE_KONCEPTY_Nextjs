'use client'

import { FunctionComponent, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './GridTransition.module.scss'

const TILE_W = 100
const TILE_H = 150

const variants = {
    v1: {
        FILLS_DURATION: 0.5,
        STAGGER_AMOUNT: 0.5,
        ROW_DELAY: 0.3,
        MOVE_X: 1, // false
        MOVE_Y: 0, // true
    },
    v2: {
        FILLS_DURATION: 0.5,
        STAGGER_AMOUNT: 0.5,
        ROW_DELAY: 0.2,
        MOVE_X: 0, // false
        MOVE_Y: 1, // true
    },
    v3: {
        FILLS_DURATION: 0.5,
        STAGGER_AMOUNT: 1,
        ROW_DELAY: 0,
        MOVE_X: 0, // false
        MOVE_Y: 1, // true
    },
    v4: {
        FILLS_DURATION: 0.5,
        STAGGER_AMOUNT: 1,
        ROW_DELAY: 0,
        MOVE_X: 1, // false
        MOVE_Y: 0, // true
    }
}

const variantKeys = Object.keys(variants) as (keyof typeof variants)[]

function randomVariant() {
    return variants[variantKeys[Math.floor(Math.random() * variantKeys.length)]]
}

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

        const INITIAL_DELAY = 1

        const handleTransition = (e: Event) => {
            const detail = (e as CustomEvent<{ to: 'dark' | 'light'; initial?: boolean }>).detail
            const to = detail.to
            const delay = detail.initial ? INITIAL_DELAY : 0
            if (!fills.length) return
            gsap.killTweensOf(fills)
            gsap.killTweensOf(container)

            const v = randomVariant()
            const totalDuration = v.FILLS_DURATION + v.STAGGER_AMOUNT

            if (to === 'dark') {
                document.documentElement.dataset.theme = 'dark'
                gsap.set(fills, { x: 0, y: 0 })
                gsap.to(fills, {
                    x: TILE_W * v.MOVE_X,
                    y: TILE_H * v.MOVE_Y,
                    duration: v.FILLS_DURATION,
                    delay,
                    ease: 'power2.in',
                    stagger: (index: number) => {
                        const col = index % cols
                        const row = Math.floor(index / cols)
                        return (col / cols) * v.STAGGER_AMOUNT + row * v.ROW_DELAY
                    },
                    onComplete: () => {
                        window.dispatchEvent(new Event('theme-transition-end'))
                    },
                })
                gsap.to(container, {
                    backgroundColor: GRID_LINE_DARK,
                    delay,
                    duration: totalDuration,
                    ease: 'none',
                })
            } else {
                gsap.set(fills, { x: -TILE_W * v.MOVE_X, y: -TILE_H * v.MOVE_Y })
                gsap.to(fills, {
                    x: 0,
                    y: 0,
                    duration: v.FILLS_DURATION,
                    ease: 'power2.out',
                    stagger: (index: number) => {
                        const col = index % cols
                        const row = Math.floor(index / cols)
                        return (col / cols) * v.STAGGER_AMOUNT + row * v.ROW_DELAY
                    },
                    onComplete: () => {
                        document.documentElement.dataset.theme = 'light'
                        window.dispatchEvent(new Event('theme-transition-end'))
                    },
                })
                gsap.to(container, {
                    backgroundColor: GRID_LINE_LIGHT,
                    duration: totalDuration,
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
