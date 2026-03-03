'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useAppSettings<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const latestValue = useRef(value)
  latestValue.current = value

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle()

      if (!cancelled) {
        if (data?.value !== undefined && data.value !== null) {
          setValue(data.value as T)
        }
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [key])

  const save = useCallback(async (newValue: T) => {
    setValue(newValue)
    await supabase
      .from('app_settings')
      .upsert({ key, value: newValue as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
  }, [key])

  return { value, setValue, save, loading }
}
