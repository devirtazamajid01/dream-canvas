import { useState, useEffect, useCallback, useRef } from 'react'
import { AsyncState } from '@/types/api'
import { handleApiError } from '@/utils/errorHandler'

interface UseAsyncOptions {
    immediate?: boolean
    onSuccess?: (data: unknown) => void
    onError?: (error: string) => void
}

export const useAsync = <T = unknown>(
    asyncFunction: (...args: unknown[]) => Promise<T>,
    options: UseAsyncOptions = {}
) => {
    const { immediate = false, onSuccess, onError } = options
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        isLoading: false,
        error: null,
    })
    const isMountedRef = useRef(true)

    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const execute = useCallback(
        async (...args: unknown[]) => {
            if (!isMountedRef.current) return

            setState((prev) => ({ ...prev, isLoading: true, error: null }))

            try {
                const result = await asyncFunction(...args)

                if (isMountedRef.current) {
                    setState({
                        data: result,
                        isLoading: false,
                        error: null,
                    })
                    onSuccess?.(result)
                }
            } catch (error) {
                if (isMountedRef.current) {
                    const errorMessage = handleApiError(error)
                    setState({
                        data: null,
                        isLoading: false,
                        error: errorMessage,
                    })
                    onError?.(errorMessage)
                }
            }
        },
        [asyncFunction, onSuccess, onError]
    )

    const reset = useCallback(() => {
        setState({
            data: null,
            isLoading: false,
            error: null,
        })
    }, [])

    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [immediate, execute])

    return {
        ...state,
        execute,
        reset,
    }
}

// Hook for handling form submissions
export const useAsyncSubmit = <T = unknown>(
    submitFunction: (...args: unknown[]) => Promise<unknown>,
    options: UseAsyncOptions = {}
) => {
    const asyncState = useAsync(submitFunction, options)

    const submit = useCallback(
        async (data: T) => {
            await asyncState.execute(data)
        },
        [asyncState]
    )

    return {
        ...asyncState,
        submit,
    }
}

// Hook for handling data fetching with pagination
export const useAsyncFetch = <T = unknown>(
    fetchFunction: (
        page: number,
        limit: number
    ) => Promise<{ data: T[]; total: number }>,
    initialPage: number = 1,
    initialLimit: number = 8
) => {
    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimit)
    const [allData, setAllData] = useState<T[]>([])
    const [total, setTotal] = useState(0)

    const fetchData = useCallback(
        async (...args: unknown[]) => {
            const [pageNum = page, limitNum = limit, append = false] = args as [
                number?,
                number?,
                boolean?
            ]
            try {
                const result = await fetchFunction(pageNum, limitNum)
                setTotal(result.total)
                if (append) {
                    setAllData((prev) => [...prev, ...result.data])
                } else {
                    setAllData(result.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        [page, limit]
    )

    const { isLoading, error } = useAsync(fetchData)

    const loadMore = useCallback(() => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchData(nextPage, limit, true)
    }, [page, limit, fetchData])

    const reset = useCallback(() => {
        setPage(initialPage)
        setAllData([])
        setTotal(0)
    }, [initialPage])

    useEffect(() => {
        fetchData(page, limit, false)
    }, [page, limit])

    return {
        data: allData,
        isLoading,
        error,
        page,
        limit,
        total,
        hasMore: allData.length < total,
        fetchData,
        loadMore,
        reset,
        setPage,
        setLimit,
    }
}
