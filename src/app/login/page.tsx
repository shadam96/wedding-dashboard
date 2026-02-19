'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeartIcon } from '@heroicons/react/24/solid'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'שגיאה בהתחברות')
      }
    } catch {
      setError('שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-rose-50 to-gold-50 dark:from-[#1a1614] dark:via-[#1f1a17] dark:to-[#1a1614]">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-lg dark:shadow-black/30 border border-rose-100 dark:border-warm-700 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 mb-4">
              <HeartIcon className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>
            <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">דשבורד חתונה</h1>
            <p className="text-warm-500 dark:text-warm-400 mt-1">הכניסו את הסיסמה כדי להמשיך</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="סיסמה"
                className="w-full px-4 py-3 rounded-xl border border-warm-200 dark:border-warm-600 bg-warm-50 dark:bg-warm-700 text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-rose-500 dark:bg-rose-600 text-white font-medium hover:bg-rose-600 dark:hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 dark:focus:ring-offset-warm-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'מתחבר...' : 'כניסה'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
