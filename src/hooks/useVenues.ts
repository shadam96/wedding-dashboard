'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Venue } from '@/types'

export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/venues')
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setVenues(
        (data || []).map((v: Record<string, unknown>) => ({
          ...v,
          available_dates: (v.available_dates as string[]) || [],
        })) as Venue[]
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  async function addVenue(venue: Omit<Venue, 'id' | 'created_at'>) {
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venue),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    const newVenue = { ...data, available_dates: data.available_dates || [] } as Venue
    setVenues((prev) => [...prev, newVenue])
    return newVenue
  }

  async function updateVenue(id: string, updates: Partial<Omit<Venue, 'id' | 'created_at'>>) {
    const res = await fetch(`/api/venues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    const updated = { ...data, available_dates: data.available_dates || [] } as Venue
    setVenues((prev) => prev.map((v) => (v.id === id ? updated : v)))
    return updated
  }

  async function deleteVenue(id: string) {
    const res = await fetch(`/api/venues/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    setVenues((prev) => prev.filter((v) => v.id !== id))
  }

  return {
    venues,
    loading,
    error,
    addVenue,
    updateVenue,
    deleteVenue,
    refetch: fetchVenues,
  }
}
