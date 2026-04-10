'use client'
import {FunctionComponent, PropsWithChildren} from 'react';
import {Overlay2} from '@blueprintjs/core';
import styles from './index.module.scss';
import {classNames} from '@/components/utils/classNames';

interface OverlayProps {
    readonly isOpen?: boolean
    readonly handleClose: () => void
    readonly className?: string;
    readonly scrollable?: boolean
}

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({isOpen = true, scrollable = true, handleClose, children, className}) => {

    return (
        <>
            {isOpen &&
                <Overlay2
                    isOpen={true}
                    onClose={() => handleClose()}
                    hasBackdrop={true}
                >
                    <div className={classNames([styles.container, scrollable ? styles.scrollable : styles.notScrollable])}>
                        <button className={styles.closeButton} onClick={() => handleClose()}>
                            ~Close
                        </button>
                        <div className={className}>
                            {children}
                        </div>
                    </div>
                </Overlay2>
            }
        </>
    )

}

export default Overlay