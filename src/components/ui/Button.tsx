import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-300 dark:bg-rose-600 dark:hover:bg-rose-500 dark:focus:ring-rose-500',
  secondary: 'bg-warm-100 text-warm-700 hover:bg-warm-200 focus:ring-warm-300 dark:bg-warm-700 dark:text-warm-200 dark:hover:bg-warm-600 dark:focus:ring-warm-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-500',
  ghost: 'text-warm-600 hover:bg-warm-100 focus:ring-warm-300 dark:text-warm-300 dark:hover:bg-warm-700 dark:focus:ring-warm-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-warm-800 disabled:opacity-50 disabled:cursor-not-allowed transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
