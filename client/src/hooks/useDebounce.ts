import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * Custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number,
    deps: React.DependencyList = []
): T => {
    const [debouncedCallback, setDebouncedCallback] = useState<T>(
        () => callback
    )

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCallback(() => callback)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [callback, delay, ...deps])

    return debouncedCallback
}
