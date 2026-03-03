'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Bus } from '@/types'

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBuses = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('buses')
      .select('*')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setBuses((data || []) as Bus[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBuses()
  }, [fetchBuses])

  async function addBus(bus: Omit<Bus, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('buses')
      .insert(bus)
      .select()
      .single()

    if (err) throw err
    setBuses((prev) => [...prev, data as Bus])
    return data as Bus
  }

  async function updateBus(id: string, updates: Partial<Omit<Bus, 'id' | 'created_at'>>) {
    const { data, error: err } = await supabase
      .from('buses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    setBuses((prev) => prev.map((b) => (b.id === id ? (data as Bus) : b)))
    return data as Bus
  }

  async function deleteBus(id: string) {
    const { error: err } = await supabase.from('buses').delete().eq('id', id)
    if (err) throw err
    setBuses((prev) => prev.filter((b) => b.id !== id))
  }

  return {
    buses,
    loading,
    error,
    addBus,
    updateBus,
    deleteBus,
    refetch: fetchBuses,
  }
}
