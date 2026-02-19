import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  )
}
