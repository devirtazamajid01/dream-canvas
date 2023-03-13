import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'link'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    loadingText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            loadingText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

        const variantClasses = {
            primary:
                'bg-primary text-primary-content hover:bg-primary/90 focus:ring-primary',
            secondary:
                'bg-secondary text-secondary-content hover:bg-secondary/90 focus:ring-secondary',
            accent: 'bg-accent text-accent-content hover:bg-accent/90 focus:ring-accent',
            ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
            outline:
                'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500',
            link: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:ring-primary',
        }

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        }

        const widthClasses = fullWidth ? 'w-full' : ''

        const isDisabled = disabled || loading

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2
                            className="w-4 h-4 mr-2 animate-spin"
                            aria-hidden="true"
                        />
                        {loadingText || 'Loading...'}
                    </>
                ) : (
                    <>
                        {leftIcon && (
                            <span className="mr-2" aria-hidden="true">
                                {leftIcon}
                            </span>
                        )}
                        {children}
                        {rightIcon && (
                            <span className="ml-2" aria-hidden="true">
                                {rightIcon}
                            </span>
                        )}
                    </>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
