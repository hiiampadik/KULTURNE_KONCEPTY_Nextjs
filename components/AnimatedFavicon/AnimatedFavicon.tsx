'use client'

import {useEffect} from 'react'

const FAVICON_FRAMES = [
    '/favicon/1.ico',
    '/favicon/2.ico',
    '/favicon/3.ico',
    '/favicon/4.ico',
]

export function AnimatedFavicon() {
    useEffect(() => {
        let index = 0

        const link =
            document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
            (() => {
                const el = document.createElement('link')
                el.rel = 'icon'
                document.head.appendChild(el)
                return el
            })()

        link.href = FAVICON_FRAMES[index]

        const interval = setInterval(() => {
            index = (index + 1) % FAVICON_FRAMES.length
            link.href = FAVICON_FRAMES[index]
        }, 800)

        return () => clearInterval(interval)
    }, [])

    return null
}
