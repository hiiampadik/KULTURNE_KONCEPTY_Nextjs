'use client'

import React, {FunctionComponent, useEffect, useState} from 'react'
import styles from './ThemeToggle.module.scss'
import {classNames} from '@/components/utils/classNames';

type Theme = 'light' | 'dark'

function getSunTimes(): { sunrise: number; sunset: number } {
    const LAT = 48.5 * Math.PI / 180
    const now = new Date()

    const dayOfYear = Math.round(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    )

    // Solar declination in radians
    const declination = -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10)) * Math.PI / 180

    // Hour angle at sunrise/sunset (sun at -0.833°)
    const cosHourAngle =
        (Math.sin(-0.01454) - Math.sin(LAT) * Math.sin(declination)) /
        (Math.cos(LAT) * Math.cos(declination))
    const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosHourAngle))) * 180 / Math.PI

    const utcOffsetHours = -now.getTimezoneOffset() / 60
    const lon = utcOffsetHours * 15
    const solarNoonUTC = 12 - lon / 15

    return {
        sunrise: solarNoonUTC - hourAngle / 15 + utcOffsetHours,
        sunset: solarNoonUTC + hourAngle / 15 + utcOffsetHours,
    }
}

function getDefaultTheme(): Theme {
    const { sunrise, sunset } = getSunTimes()
    const hour = new Date().getHours() + new Date().getMinutes() / 60
    return hour >= sunrise && hour < sunset ? 'light' : 'dark'
}

export const ThemeToggle: FunctionComponent = () => {
    const [theme, setTheme] = useState<Theme>('light')
    const [transitioning, setTransitioning] = useState(false)

    useEffect(() => {
        const saved = sessionStorage.getItem('theme') as Theme | null
        const initial = saved ?? getDefaultTheme()
        setTheme(initial)
        if (initial === 'dark') {
            window.dispatchEvent(new CustomEvent('theme-transition', { detail: { to: 'dark', initial: true } }))
        }
    }, [])

    useEffect(() => {
        const onEnd = () => setTransitioning(false)
        window.addEventListener('theme-transition-end', onEnd)
        return () => window.removeEventListener('theme-transition-end', onEnd)
    }, [])

    const toggle = () => {
        if (transitioning) return
        setTransitioning(true)
        const next: Theme = theme === 'light' ? 'dark' : 'light'
        setTheme(next)
        sessionStorage.setItem('theme', next)
        window.dispatchEvent(new CustomEvent('theme-transition', { detail: { to: next } }))
    }

    return (
        <button className={classNames([styles.button, transitioning && styles.transitioning])} onClick={toggle} disabled={transitioning} aria-label="Toggle theme">
            <img
                src={theme === 'light' ? '/moon.svg' : '/sun.svg'}
                alt={theme === 'light' ? 'Light mode' : 'Dark mode'}
                className={styles.icon}
            />
        </button>
    )
}
