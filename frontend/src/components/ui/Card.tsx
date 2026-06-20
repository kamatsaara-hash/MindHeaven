import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass' | 'gradient'
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm',
      glass: 'glass',
      gradient: 'bg-gradient-to-br from-lavender-500/10 to-soft-teal-500/10 border border-lavender-200 dark:border-lavender-900',
    }

    return (
      <motion.div
        ref={ref}
        className={`rounded-2xl p-6 transition-all duration-300 ${variants[variant]} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      error: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    }

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    }

    return (
      <span ref={ref} className={`rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
