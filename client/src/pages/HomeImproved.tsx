import React, { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import RootSection from '@/components/RootSection'
import ImageGenerator from '@/components/ImageGenerator'
import ImageGallery from '@/components/ImageGallery'
import ImageModal from '@/components/ImageModal'
import ErrorModal from '@/components/ErrorModal'
import { initParallax } from '@/utils/parallax'
import { Image, ImageModalState } from '@/types/api'

const HomeImproved: React.FC = () => {
    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        imgSrc: null,
        open: false,
        prompt: '',
    })
    const [errorModalOpen, setErrorModalOpen] = useState(false)

    // Initialize parallax effect
    useEffect(() => {
        const cleanup = initParallax()
        return cleanup
    }, [])

    const handleImageGenerated = useCallback((image: Image) => {
        // You could add the image to a local state or trigger a refresh
        console.log('Image generated:', image)
        // Optionally show a success message or update the gallery
    }, [])

    const handleImageClick = useCallback((image: Image) => {
        setImageModalState({
            imgSrc: image.imageUrl,
            open: true,
            prompt: image.prompt,
        })
    }, [])

    const handleError = useCallback((error: string) => {
        console.error('Error:', error)
        setErrorModalOpen(true)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Header />

            <main className="relative">
                {/* Hero Section */}
                <RootSection className="relative z-10">
                    <div className="text-center py-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            AI Image Generator
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                            Create stunning images with the power of artificial
                            intelligence. Describe your vision and watch it come
                            to life.
                        </p>

                        <ImageGenerator
                            onImageGenerated={handleImageGenerated}
                            onError={handleError}
                        />
                    </div>
                </RootSection>

                {/* Gallery Section */}
                <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Explore Generated Images
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Discover amazing images created by our community
                            </p>
                        </div>

                        <ImageGallery onImageClick={handleImageClick} />
                    </div>
                </section>
            </main>

            {/* Modals */}
            <ImageModal
                dialogState={imageModalState}
                setDialogState={setImageModalState}
            />

            <ErrorModal open={errorModalOpen} setIsOpen={setErrorModalOpen} />
        </div>
    )
}

export default HomeImproved
