// Parallax scroll effect utility
export const initParallax = () => {
    const updateScroll = () => {
        const scrollY = window.scrollY
        document.documentElement.style.setProperty(
            '--scroll',
            scrollY.toString()
        )
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll() // Initial call

    return () => {
        window.removeEventListener('scroll', updateScroll)
    }
}
