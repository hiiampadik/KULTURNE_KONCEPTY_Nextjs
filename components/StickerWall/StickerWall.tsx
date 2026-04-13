'use client'

import React, {CSSProperties, FunctionComponent, startTransition, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {InertiaPlugin} from 'gsap/InertiaPlugin'
import {Draggable} from './gsapDraggable'
import styles from './StickerWall.module.scss'

gsap.registerPlugin(InertiaPlugin, Draggable)

interface StickerData {
    src: string
    left: number
    top: number
    rotation: number
}

interface StickerItemProps extends StickerData {
    index: number
}

interface StickerWallProps {
    stickers: string[]
}

const StickerItem: FunctionComponent<StickerItemProps> = ({src, left, top, rotation, index}) => {
    const elementRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = elementRef.current
        if (!el) return
        gsap.set(el, {rotate: rotation, scale: 0})
    }, [rotation])

    useEffect(() => {
        const el = elementRef.current
        if (!el) return

        gsap.to(el, {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.08,
        })

        const offset = Math.random() * 2
        const floatTween = gsap.to(el, {
            y: `+=${6 + Math.random() * 6}`,
            x: `+=${6 + Math.random() * 6}`,
            rotation: `+=${(Math.random() - 0.5) * 4}`,
            duration: 1.8 + Math.random() * 1.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: offset,
        })

        InertiaPlugin.track(el, 'x,y')

        const [draggable] = Draggable.create(el, {
            type: 'x,y',
            onDragStart() {
                floatTween.pause()
            },
            onDragEnd() {
                const vx = InertiaPlugin.getVelocity(el, 'x')
                const vy = InertiaPlugin.getVelocity(el, 'y')
                gsap.to(el, {
                    inertia: {
                        x: {velocity: vx},
                        y: {velocity: vy},
                        resistance: 2500,
                        duration: {min: 0.1, max: 0.4},
                    },
                    onComplete() {
                        floatTween.resume()
                    },
                })
            },
        })

        return () => {
            floatTween.kill()
            InertiaPlugin.untrack(el)
            draggable.kill()
        }
    }, [])

    return (
        <div
            className={styles.stickerWrapper}
            style={{'--sx': `${left}%`, '--sy': `${top}%`} as CSSProperties}
        >
            <div ref={elementRef} className={styles.sticker}>
                <img src={src} alt="" className={styles.image} draggable={false}/>
            </div>
        </div>
    )
}

export const StickerWall: FunctionComponent<StickerWallProps> = ({stickers}) => {
    const [stickerData, setStickerData] = useState<StickerData[] | null>(null)

    useEffect(() => {
        if (!stickers.length) return

        const cols = 3
        const rows = Math.max(1, Math.ceil(stickers.length / cols))
        const cellW = 70 / cols
        const cellH = 80 / rows
        const zones = stickers.map((_, i) => ({
            col: i % cols,
            row: Math.floor(i / cols),
        }))

        startTransition(() => {
            setStickerData(stickers.map((src, i) => ({
                src,
                left: 25 + zones[i].col * cellW + Math.random() * (cellW - 10),
                top: 5 + zones[i].row * cellH + Math.random() * (cellH - 10),
                rotation: (Math.random() - 0.5) * 30,
            })))
        })
    }, [stickers])

    if (!stickerData) return <div className={styles.wall} aria-hidden="true" />

    return (
        <div className={styles.wall} aria-hidden="true">
            {stickerData.map((data, i) => (
                <StickerItem key={data.src} {...data} index={i}/>
            ))}
        </div>
    )
}
