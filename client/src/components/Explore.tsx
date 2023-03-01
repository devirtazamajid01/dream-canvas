import React, { useEffect, useState } from 'react'
import { Image, ImageModalState } from '../types/types'
import ImageService from '../services/image.service'
import { removeDuplicatesById } from '../utils'
import RootSection from './RootSection'

interface ImageModalProps {
    setImageModalState: React.Dispatch<React.SetStateAction<ImageModalState>>
}

const Explore: React.FC<ImageModalProps> = ({ setImageModalState }) => {
    const [generatedImages, setGeneratedImages] = useState<Image[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', handleInfiniteScroll)

        return () => window.removeEventListener('scroll', handleInfiniteScroll)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isEnded && !isFetching) {
            fetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const handleInfiniteScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((page) => page + 1)
        }
    }

    const fetch = async () => {
        try {
            setIsFetching(true)
            const res = await ImageService.fetchImages(page)

            if (res.code === 201 || res.code === 200) {
                const images: Image[] = res?.data || []

                setIsEnded(images.length === 0)

                setGeneratedImages((preValue) =>
                    removeDuplicatesById([...preValue, ...images])
                )
            }
        } catch (error) {
            console.log('Error : ', error)
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <RootSection>
            <div className="container mx-auto max-w-screen-xl mt-20 px-4 relative z-content">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="heading-accent text-2xl sm:text-3xl font-bold text-gray-900">
                            Explore creations
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Discover what others have generated recently.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-content">
                    {generatedImages.length > 0 &&
                        generatedImages.map((image) => (
                            <div
                                key={image._id}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg ring-1 ring-gray-200 transition hover:ring-brand-accent/30 card-hover card-shine z-content"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setImageModalState((pre) => ({
                                        ...pre,
                                        open: true,
                                        imgSrc: image.imageUrl,
                                        prompt: image.prompt,
                                    }))
                                }}
                            >
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        className="h-full w-full object-cover object-center transform group-hover:scale-105 transition duration-300"
                                        src={image.imageUrl}
                                        alt={image.prompt}
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                    <p className="line-clamp-2 text-xs text-white/90">
                                        {image.prompt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    {isFetching &&
                        [1, 2, 3, 4, 5, 6, 7, 8].map((ele) => (
                            <div
                                key={ele}
                                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-cyan-100 to-indigo-100 animate-pulse z-content"
                            />
                        ))}
                </div>
            </div>
        </RootSection>
    )
}

export default Explore
