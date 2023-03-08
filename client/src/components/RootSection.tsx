import React from 'react'

interface RootSectionProps {
    children: React.ReactNode
    className?: string
}

const RootSection: React.FC<RootSectionProps> = ({
    children,
    className = '',
}) => {
    return (
        <section
            className={`root-section relative overflow-hidden ${className}`}
        >
            <div className="root-section__bg absolute inset-0 -z-10 bg-gradient-to-b from-cyan-50 via-white to-white" />
            <div className="blob blob--one -top-20 -left-20 parallax-slow" />
            <div className="blob blob--two -bottom-24 -right-20 parallax-fast" />
            {children}
        </section>
    )
}

export default RootSection
