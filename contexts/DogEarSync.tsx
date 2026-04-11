'use client'
import React, {createContext, FunctionComponent, useContext, useState} from 'react'

interface DogEarSyncContextValue {
    hoveredSection: string | null
    setHoveredSection: (id: string | null) => void
}

const DogEarSyncContext = createContext<DogEarSyncContextValue>({
    hoveredSection: null,
    setHoveredSection: () => {},
})

export const DogEarSyncProvider: FunctionComponent<{children: React.ReactNode}> = ({children}) => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null)
    return (
        <DogEarSyncContext.Provider value={{hoveredSection, setHoveredSection}}>
            {children}
        </DogEarSyncContext.Provider>
    )
}

export const useDogEarSync = () => useContext(DogEarSyncContext)
