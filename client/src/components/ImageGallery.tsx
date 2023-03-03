import React, { useCallback, useMemo } from 'react'
import { useAsyncFetch } from '@/hooks/useAsync'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import imageService from '@/services/image.service'
import { Image } from '@/types/api'
import { removeDuplicatesById } from '@/utils'

interface ImageGalleryProps {
    onImageClick: (image: Image) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ onImageClick }) => {
    const {
        data: images,
        isLoading,
        error,
        hasMore,
        loadMore,
        reset,
    } = useAsyncFetch(
        async (page: number, limit: number) => {
            const response = await imageService.fetchImages(page, limit)
            if (response.success && response.data) {
                return {
                    data: response.data,
                    total: response.pagination.total,
                }
            }
            throw new Error(response.message || 'Failed to fetch images')
        },
        1,
        8
    )

    const handleImageClick = useCallback(
        (image: Image) => {
            onImageClick(image)
        },
        [onImageClick]
    )

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            loadMore()
        }
    }, [hasMore, isLoading, loadMore])

    const handleRetry = useCallback(() => {
        reset()
    }, [reset])

    const memoizedImages = useMemo(() => {
        return removeDuplicatesById(images)
    }, [images])

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4">
                <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {memoizedImages.map((image) => (
                    <div
                        key={image._id}
                        className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleImageClick(image)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View image: ${image.prompt}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleImageClick(image)
                            }
                        }}
                    >
                        <div className="aspect-square relative overflow-hidden">
                            <img
                                src={image.imageUrl}
                                alt={image.prompt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {image.prompt}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {new Date(image.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" text="Loading images..." />
                </div>
            )}

            {hasMore && !isLoading && (
                <div className="flex justify-center py-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        aria-label="Load more images"
                    >
                        Load More
                    </button>
                </div>
            )}

            {!hasMore && memoizedImages.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        You've reached the end of the gallery
                    </p>
                </div>
            )}

            {memoizedImages.length === 0 && !isLoading && !error && (
                <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No images yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Generate your first image to get started!
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageGallery
