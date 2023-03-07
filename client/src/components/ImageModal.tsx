import React, { useEffect, useRef, useState } from 'react'
import FileSaver from 'file-saver'
import classNames from 'classnames'
import { ImageModalState } from '../types/types'

interface ImageModalProps {
    dialogState: ImageModalState
    setDialogState: React.Dispatch<React.SetStateAction<ImageModalState>>
}

const ImageModal: React.FC<ImageModalProps> = ({
    dialogState,
    setDialogState,
}) => {
    const [isCopied, setIsCopied] = useState(false)

    const [isDownloaded, setIsDownloaded] = useState(false)

    const { imgSrc, open, prompt } = dialogState

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
            setIsCopied(false)
            setIsDownloaded(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const clearModalContent = () => {
        setTimeout(() => {
            setDialogState({
                ...dialogState,
                open: false,
                imgSrc: '',
                prompt: '',
            })
        }, 500)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            setDialogState({
                ...dialogState,
                open: false,
            })
            clearModalContent()
        }
    }

    const handleClose = () => {
        setDialogState({ ...dialogState, open: false })
        clearModalContent()
    }

    const handleDownload = (url: string | null) => {
        if (url) {
            FileSaver.saveAs(
                url,
                `download_${new Date().toLocaleDateString()}.png`
            )
            setIsDownloaded(true)
        }
    }

    const handleCopyPrompt = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
        } catch (error) {
            alert('something went wrong')
        }
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
                    className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-white shadow-xl ring-1 ring-black/10"
                    ref={modalRef}
                >
                    <button
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-700 hover:bg-black/10"
                        onClick={handleClose}
                    >
                        ✕
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="p-4 lg:p-6 bg-gray-50">
                            <div className="aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white">
                                <img
                                    className="h-full w-full object-contain"
                                    src={imgSrc || ''}
                                    alt={prompt}
                                />
                            </div>
                        </div>
                        <div className="p-4 lg:p-6 flex flex-col modal-light">
                            <h3 className="text-base font-semibold text-gray-900">
                                Prompt
                            </h3>
                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap flex-1">
                                {prompt}
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-2">
                                {isCopied ? (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
                                    >
                                        ✓ Copied
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 text-cyan-700 hover:bg-cyan-50 px-4 py-2 text-sm font-semibold"
                                        onClick={() => handleCopyPrompt(prompt)}
                                    >
                                        Copy prompt
                                    </button>
                                )}

                                {isDownloaded ? (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
                                    >
                                        ✓ Downloaded
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-gradientFrom to-brand-gradientTo hover:from-cyan-500 hover:to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                                        onClick={() => handleDownload(imgSrc)}
                                    >
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageModal
