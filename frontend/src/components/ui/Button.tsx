import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'

    const variants = {
      primary:
        'bg-gradient-to-r from-lavender-500 to-soft-teal-500 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50',
      secondary: 'bg-pastel-blue-400 text-white hover:bg-pastel-blue-500 disabled:opacity-50',
      outline:
        'border-2 border-lavender-500 text-lavender-600 dark:text-lavender-400 hover:bg-lavender-50 dark:hover:bg-slate-900 disabled:opacity-50',
      ghost:
        'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || disabled}
        whileHover={{ scale: isLoading || disabled ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
