import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
    message: string
    onRetry?: () => void
    className?: string
    showIcon?: boolean
    variant?: 'error' | 'warning' | 'info'
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    className = '',
    showIcon = true,
    variant = 'error',
}) => {
    const variantClasses = {
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
        warning:
            'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    }

    const iconClasses = {
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
    }

    return (
        <div
            className={`flex items-center gap-3 p-4 border rounded-lg ${variantClasses[variant]} ${className}`}
            role="alert"
            aria-live="polite"
        >
            {showIcon && (
                <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 ${iconClasses[variant]}`}
                    aria-hidden="true"
                />
            )}
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-white/50 hover:bg-white/70 dark:bg-black/20 dark:hover:bg-black/40 transition-colors"
                    aria-label="Retry"
                >
                    <RefreshCw className="w-3 h-3" aria-hidden="true" />
                    Retry
                </button>
            )}
        </div>
    )
}

export default ErrorMessage
