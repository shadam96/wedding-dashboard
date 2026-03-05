'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Bus } from '@/types'

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBuses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/buses')
      if (!res.ok) throw new Error(await res.text())
      const data: Bus[] = await res.json()
      setBuses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch buses')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBuses()
  }, [fetchBuses])

  async function addBus(bus: Omit<Bus, 'id' | 'created_at'>) {
    const res = await fetch('/api/buses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Bus = await res.json()
    setBuses((prev) => [...prev, data])
    return data
  }

  async function updateBus(id: string, updates: Partial<Omit<Bus, 'id' | 'created_at'>>) {
    const res = await fetch(`/api/buses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Bus = await res.json()
    setBuses((prev) => prev.map((b) => (b.id === id ? data : b)))
    return data
  }

  async function deleteBus(id: string) {
    const res = await fetch(`/api/buses/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
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
