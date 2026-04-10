import React, {FunctionComponent} from 'react'
import styles from './DogEar.module.scss'

export type DogEarCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface DogEarProps {
    corner?: DogEarCorner
    size?: number
    children: React.ReactNode
}

export const DogEar: FunctionComponent<DogEarProps> = ({
    corner = 'bottom-right',
    size = 40,
    children,
}) => {
    return (
        <div
            className={styles.dogEar}
            data-corner={corner}
            style={{'--size': `${size}px`} as React.CSSProperties}
        >
            <div className={styles.inner}>
                {children}
            </div>
            <div className={styles.triangle} />
        </div>
    )
}
