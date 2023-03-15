import React, { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
    as?: 'input' | 'textarea'
    rows?: number
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            id,
            as = 'input',
            rows,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substring(7)}`
        const hasError = Boolean(error)

        const baseClasses =
            'block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'

        const stateClasses = hasError
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-primary'

        const backgroundClasses = 'bg-white dark:bg-gray-800'

        const widthClasses = fullWidth ? 'w-full' : ''

        const paddingClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''

        return (
            <div className={`${widthClasses}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span
                                className="text-gray-400 dark:text-gray-500"
                                aria-hidden="true"
                            >
                                {leftIcon}
                            </span>
                        </div>
                    )}
                    {as === 'textarea' ? (
                        <textarea
                            ref={ref as React.Ref<HTMLTextAreaElement>}
                            id={inputId}
                            rows={rows || 3}
                            className={`${baseClasses} ${stateClasses} ${backgroundClasses} ${paddingClasses} ${className}`}
                            aria-invalid={hasError}
                            aria-describedby={
                                error
                                    ? `${inputId}-error`
                                    : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                            }
                            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <input
                            ref={ref}
                            id={inputId}
                            className={`${baseClasses} ${stateClasses} ${backgroundClasses} ${paddingClasses} ${className}`}
                            aria-invalid={hasError}
                            aria-describedby={
                                error
                                    ? `${inputId}-error`
                                    : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                            }
                            {...props}
                        />
                    )}
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span
                                className="text-gray-400 dark:text-gray-500"
                                aria-hidden="true"
                            >
                                {rightIcon}
                            </span>
                        </div>
                    )}
                    {hasError && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <AlertCircle
                                className="w-5 h-5 text-red-500"
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p
                        id={`${inputId}-helper`}
                        className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
