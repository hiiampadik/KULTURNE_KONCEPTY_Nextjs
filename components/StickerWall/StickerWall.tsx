'use client'

import React, {FunctionComponent, useEffect, useRef, useState, CSSProperties} from 'react'
import {motion, useMotionValue, animate} from 'motion/react'
import styles from './StickerWall.module.scss'

const STICKERS = [
    '/stickers/Group 14.png',
    '/stickers/Vrstva_1-2.png',
    '/stickers/Vrstva_1-3.png',
    '/stickers/Vrstva_1-4.png',
    '/stickers/Vrstva_1.png',
]

interface StickerItemProps {
    src: string
    left: number
    top: number
    rotation: number
    idleDelay: number
}

const StickerItem: FunctionComponent<StickerItemProps> = ({src, left, top, rotation, idleDelay}) => {
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const isDragging = useRef(false)
    const stopped = useRef(false)
    const runningAnims = useRef<ReturnType<typeof animate>[]>([])

    const stopIdle = () => {
        runningAnims.current.forEach(a => a.stop())
        runningAnims.current = []
    }

    const startIdle = () => {
        const runLoop = async () => {
            while (!isDragging.current && !stopped.current) {
                const tx = mx.get() + (Math.random() - 0.5) * 40
                const ty = my.get() + (Math.random() - 0.5) * 40
                const duration = 2.5 + Math.random() * 2

                const ax = animate(mx, tx, {duration, ease: 'easeInOut'})
                const ay = animate(my, ty, {duration, ease: 'easeInOut'})
                runningAnims.current = [ax, ay]

                await Promise.all([ax, ay])
                runningAnims.current = []

                if (isDragging.current || stopped.current) break
                await new Promise<void>(r => setTimeout(r, 400 + Math.random() * 600))
            }
        }
        runLoop()
    }

    useEffect(() => {
        const timer = setTimeout(startIdle, idleDelay)
        return () => {
            clearTimeout(timer)
            stopped.current = true
            stopIdle()
        }
    }, [])

    return (
        <div
            className={styles.stickerWrapper}
            style={{'--sx': `${left}%`, '--sy': `${top}%`} as CSSProperties}
        >
            <motion.div
                className={styles.sticker}
                style={{x: mx, y: my, rotate: rotation}}
                drag
                dragMomentum
                dragElastic={0}
                dragTransition={{power: 0.1, timeConstant: 700, restDelta: 0.01}}
                onDragStart={() => {
                    isDragging.current = true
                    stopIdle()
                }}
                onDragEnd={() => {
                    isDragging.current = false
                    setTimeout(startIdle, 1000)
                }}
            >
                <img src={src} alt="" className={styles.image} draggable={false}/>
            </motion.div>
        </div>
    )
}

export const StickerWall: FunctionComponent = () => {
    const [stickerData, setStickerData] = useState<StickerItemProps[] | null>(null)

    useEffect(() => {
        const cols = 3
        const rows = 2
        const cellW = 70 / cols
        const cellH = 80 / rows
        const zones = STICKERS.map((_, i) => ({
            col: i % cols,
            row: Math.floor(i / cols),
        }))

        setStickerData(STICKERS.map((src, i) => ({
            src,
            left: 25 + zones[i].col * cellW + Math.random() * (cellW - 10),
            top: 5 + zones[i].row * cellH + Math.random() * (cellH - 10),
            rotation: (Math.random() - 0.5) * 30,
            idleDelay: Math.random() * 2000,
        })))
    }, [])

    if (!stickerData) return <div className={styles.wall} />

    return (
        <div className={styles.wall}>
            {stickerData.map((data) => (
                <StickerItem key={data.src} {...data}/>
            ))}
        </div>
    )
}
