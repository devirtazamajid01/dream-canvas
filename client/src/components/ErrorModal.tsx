import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import errorImg from '../assets/error_500.jpg'

interface ErrorModalProps {
    open: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, setIsOpen }) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
            document.addEventListener('click', handleClickOutside)
        } else {
            document.body.style.overflow = 'unset'
            document.removeEventListener('click', handleClickOutside)
        }

        return () => {
            document.body.style.overflow = 'unset'
            document.removeEventListener('click', handleClickOutside)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div
                className={classNames(
                    'fixed inset-0 z-modal flex items-center justify-center p-4',
                    {
                        hidden: !open,
                    }
                )}
            >
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                />
                <div
                    className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
                    ref={modalRef}
                >
                    <button
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-700 hover:bg-black/10"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                    <div className="p-6">
                        <div className="w-full flex justify-center">
                            <img
                                className="rounded-xl max-h-72"
                                src={errorImg}
                                alt={'Internal Server Error'}
                            />
                        </div>
                        <h3 className="mt-6 text-center text-lg font-semibold text-gray-900">
                            Service is busy
                        </h3>
                        <p className="mb-7 mt-2 text-center text-sm text-gray-600">
                            We are experiencing high demand and may be unable to
                            process your request. Please try again shortly.
                        </p>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ErrorModal
