import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'light',
    storageKey = 'theme',
}) => {
    const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(
        storageKey,
        defaultTheme
    )
    const [theme, setTheme] = useState<Theme>(storedTheme)
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
        'light'
    )

    // Get system theme
    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window === 'undefined') return 'light'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    }, [])

    // Resolve theme based on current setting
    const resolveTheme = useCallback(
        (currentTheme: Theme): 'light' | 'dark' => {
            if (currentTheme === 'system') {
                return getSystemTheme()
            }
            return currentTheme
        },
        [getSystemTheme]
    )

    // Update resolved theme
    useEffect(() => {
        const resolved = resolveTheme(theme)
        setResolvedTheme(resolved)
    }, [theme, resolveTheme])

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                setResolvedTheme(getSystemTheme())
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, getSystemTheme])

    // Apply theme to document
    useEffect(() => {
        if (typeof document === 'undefined') return

        const root = document.documentElement
        root.setAttribute('data-theme', resolvedTheme)

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]'
        )
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
            )
        }
    }, [resolvedTheme])

    // Sync with localStorage
    useEffect(() => {
        setStoredTheme(theme)
    }, [theme, setStoredTheme])

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    const handleSetTheme = useCallback((newTheme: Theme) => {
        setTheme(newTheme)
    }, [])

    const value: ThemeContextType = {
        theme,
        resolvedTheme,
        toggleTheme,
        setTheme: handleSetTheme,
    }

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}
