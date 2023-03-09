import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IMAGE_SIZES } from '../constant'

interface SizeSelectorProps {
    value: string
    onValueChange: (value: string) => void
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
    value,
    onValueChange,
}) => {
    const [open, setOpen] = useState(false)
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const toggleDropdown = () => {
        if (!open && buttonRef.current) {
            setButtonRect(buttonRef.current.getBoundingClientRect())
        }
        setOpen(!open)
    }
    const closeDropdown = () => {
        setOpen(false)
        setButtonRect(null)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeDropdown()
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('scroll', closeDropdown, true)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('scroll', closeDropdown, true)
        }
    }, [open])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeDropdown()
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    return (
        <div
            className="dropdown-container relative inline-block text-left z-50"
            ref={dropdownRef}
        >
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleDropdown}
                className="inline-flex w-full justify-center gap-x-2 rounded-xl bg-white/95 backdrop-blur px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 hover:bg-white hover:ring-cyan-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <span className="truncate">{value}</span>
                <svg
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {open &&
                buttonRect &&
                createPortal(
                    <div
                        className="dropdown-menu fixed w-56 origin-top-right rounded-xl bg-white/98 dark:bg-slate-800 dark:text-slate-100 backdrop-blur-xl shadow-2xl ring-1 ring-black/10 dark:ring-slate-700 transition-all duration-200 z-50"
                        style={{
                            top: buttonRect.bottom + 8,
                            right: window.innerWidth - buttonRect.right,
                            zIndex: 9999,
                        }}
                        ref={dropdownRef}
                    >
                        <ul className="py-2" role="menu">
                            {IMAGE_SIZES.map((size) => (
                                <li key={size.value} role="menuitem">
                                    <button
                                        className={`${
                                            value === size.value
                                                ? 'is-selected bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 font-semibold dark:bg-slate-700 dark:text-white'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:text-slate-200 hover:dark:from-slate-700 hover:dark:to-slate-600'
                                        } w-full text-left block px-4 py-3 text-sm transition-all duration-150 hover:scale-[1.02]`}
                                        onClick={() => {
                                            onValueChange(size.value)
                                            closeDropdown()
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{size.label}</span>
                                            {value === size.value && (
                                                <svg
                                                    className="h-4 w-4 text-cyan-600 dark:text-cyan-300"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>,
                    document.body
                )}
        </div>
    )
}

export default SizeSelector
