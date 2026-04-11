import React, {FunctionComponent} from 'react'
import styles from './DogEar.module.scss'
import {classNames} from '@/components/utils/classNames';

export type DogEarCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface DogEarProps {
    corner?: DogEarCorner
    size?: number
    hoverSize?: number
    shadow?: boolean
    bgTriangle?: boolean
    forceHover?: boolean
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
    children: React.ReactNode
    className?: string
}

export const DogEar: FunctionComponent<DogEarProps> = ({
    corner = 'bottom-right',
    size = 40,
    hoverSize,
    shadow = false,
    bgTriangle = false,
    forceHover = false,
    onMouseEnter,
    onMouseLeave,
    children, className,
}) => {
    return (
        <div
            className={classNames([styles.dogEar, shadow && styles.shadow, bgTriangle && styles.bgTriangle, className])}
            data-corner={corner}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                '--size': `${size}px`,
                ...(hoverSize != null ? {'--hover-grow-target': `${hoverSize}px`} as Record<string, string> : {}),
                ...(forceHover ? {'--hover-grow': 'var(--hover-grow-target)'} as Record<string, string> : {}),
            } as React.CSSProperties}
        >
            <div className={styles.inner}>
                {children}
            </div>
            <div className={styles.triangle}/>
        </div>
    )
}
