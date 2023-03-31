import { useState, useEffect } from 'react'
import Header from '../components/Header'
import SizeSelector from '../components/SizeSelector'
import RootSection from '../components/RootSection'
import { IMAGE_SIZES } from '../constant'
import { getSurprisePrompt, removeDuplicatesById } from '../utils'
import { initParallax } from '../utils/parallax'
import imageService from '../services/image.service'
import ImageService from '../services/image.service'
import ImageModal from '../components/ImageModal'
import { ImageModalState, Image } from '../types/types'
import classNames from 'classnames'
import ErrorModal from '../components/ErrorModal'

function Home() {
    const [sizeValue, setSizeValue] = useState(IMAGE_SIZES[0]?.value || 'Small')
    const [IsGenerating, setIsGenerating] = useState(false)
    const [imageModalState, setImageModalState] = useState<ImageModalState>({
        imgSrc: null,
        open: false,
        prompt: '',
    })
    const [errorModelOpen, setErrorModelOpen] = useState(false)
    const [prompt, setPrompt] = useState('')

    // Explore component state
    const [generatedImages, setGeneratedImages] = useState<Image[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)

    useEffect(() => {
        const cleanup = initParallax()
        return cleanup
    }, [])

    // Explore component effects
    useEffect(() => {
        window.addEventListener('scroll', handleInfiniteScroll)
        return () => window.removeEventListener('scroll', handleInfiniteScroll)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isEnded && !isFetching) {
            fetchImages()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const generateImage = async () => {
        setIsGenerating(true)
        try {
            const res = await imageService.generateImage({
                prompt,
                size: sizeValue as 'Small' | 'Medium' | 'Large',
            })

            if (res.code === 201 || res.code === 200) {
                const imageUrl = res?.data?.imageUrl

                setImageModalState((pre) => ({
                    ...pre,
                    imgSrc: imageUrl || null,
                    open: true,
                    prompt: prompt,
                }))
            } else {
                setErrorModelOpen(true)
            }
        } catch (error) {
            setErrorModelOpen(true)
        } finally {
            setIsGenerating(false)
        }
    }

    // Explore component functions
    const handleInfiniteScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((page) => page + 1)
        }
    }

    const fetchImages = async () => {
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
        <>
            <Header />
            <RootSection>
                <div className="container mx-auto max-w-screen-xl px-4 pb-20">
                    <div className="pt-12 sm:pt-16 lg:pt-28 text-center">
                        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                            Transform your ideas into
                            <span className="bg-gradient-to-r from-brand-gradientFrom via-brand-gradientVia to-brand-gradientTo bg-clip-text text-transparent">
                                {' '}
                                breathtaking images
                            </span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-gray-600">
                            Describe your vision and let our AI craft
                            high‑quality visuals in seconds.
                        </p>
                    </div>

                    <div className="mx-auto mt-10 max-w-3xl relative z-content">
                        <div className="search-panel rounded-2xl bg-white/70 backdrop-blur shadow-lg ring-1 ring-gray-200 p-3 sm:p-4 relative z-content overflow-visible">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center relative z-content">
                                <input
                                    type="text"
                                    value={prompt}
                                    placeholder="Describe what you want the AI to draw..."
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="search-panel__input flex-1 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none relative z-content"
                                />
                                <div className="relative z-dropdown">
                                    <SizeSelector
                                        value={sizeValue}
                                        onValueChange={(value) => {
                                            setSizeValue(value)
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={generateImage}
                                    className={classNames(
                                        'btn-aurora inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition relative z-content',
                                        {
                                            'opacity-60 pointer-events-none':
                                                prompt === '',
                                        },
                                        { 'animate-pulse': IsGenerating }
                                    )}
                                >
                                    {IsGenerating ? 'Generating…' : 'Generate'}
                                </button>
                            </div>
                            <div className="mt-3 flex items-center justify-center gap-2 text-sm relative z-content">
                                <span className="search-panel__helper text-gray-600">
                                    Need inspiration?
                                </span>
                                <button
                                    className="search-panel__link text-cyan-700 hover:text-indigo-700 font-medium"
                                    onClick={() => {
                                        setPrompt(getSurprisePrompt(prompt))
                                    }}
                                >
                                    Surprise me
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Explore Section - now part of the same RootSection */}
                    <div className="mt-20 relative z-content">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="heading-accent text-2xl sm:text-3xl font-bold text-gray-900">
                                    Explore creations
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Discover what others have generated
                                    recently.
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
                </div>
            </RootSection>

            <div className="mb-16" />

            <ImageModal
                dialogState={imageModalState}
                setDialogState={setImageModalState}
            />
            <ErrorModal open={errorModelOpen} setIsOpen={setErrorModelOpen} />
        </>
    )
}

export default Home
