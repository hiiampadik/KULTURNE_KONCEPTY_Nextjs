'use client'
import {FunctionComponent, useState} from 'react'
import {useTranslations} from 'next-intl'
import Overlay from '@/components/Overlay'
import {ProjectDetail, ProjectDetailData} from '@/components/ProjectDetail/ProjectDetail'
import styles from './OverlayProject.module.scss'

export type OverlayProjectData = ProjectDetailData

interface OverlayProjectProps {
    readonly isOpen: boolean
    readonly handleClose: () => void
    readonly project: OverlayProjectData | null
    readonly fieldIconMap?: Record<string, string>
}

export const OverlayProject: FunctionComponent<OverlayProjectProps> = ({isOpen, handleClose, project, fieldIconMap = {}}) => {
    const t = useTranslations('OverlayProject')
    const [lastProject, setLastProject] = useState<OverlayProjectData | null>(project)

    if (project && project !== lastProject) {
        setLastProject(project)
    }

    const displayProject = project ?? lastProject

    const icons = displayProject?.fields
        ?.map(f => ({url: fieldIconMap[f._id], title: f.title}))
        .filter(item => Boolean(item.url)) ?? []

    const handleCopyLink = () => {
        if (typeof window === 'undefined') return
        navigator.clipboard?.writeText(window.location.href)
    }

    const linkButton = displayProject?.id ? (
        <button type="button" className={styles.linkButton} onClick={handleCopyLink} aria-label={t('copyLink')}>
            <img src="/link.svg" alt="" aria-hidden="true"/>
        </button>
    ) : null

    return (
        <Overlay isOpen={isOpen} handleClose={handleClose} icons={icons} toolbarExtras={linkButton}>
            {displayProject && (
                <ProjectDetail project={displayProject} fieldIconMap={fieldIconMap}/>
            )}
        </Overlay>
    )
}
