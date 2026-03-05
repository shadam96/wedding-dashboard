'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useAppSettings<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const latestValue = useRef(value)
  latestValue.current = value

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/settings?key=${encodeURIComponent(key)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data.value !== undefined && data.value !== null) {
          setValue(data.value as T)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [key])

  const save = useCallback(async (newValue: T) => {
    setValue(newValue)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: newValue }),
    })
  }, [key])

  return { value, setValue, save, loading }
}
