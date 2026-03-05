'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Guest } from '@/types'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/guests')
      if (!res.ok) throw new Error(await res.text())
      const data: Guest[] = await res.json()
      setGuests(data.map((g) => ({
        ...g,
        will_dance: g.will_dance ?? false,
        plus_one_will_dance: g.plus_one_will_dance ?? false,
        children: (g.children || []).map((c) => ({ ...c, will_dance: c.will_dance ?? false })),
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guests')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  async function addGuest(guest: Omit<Guest, 'id' | 'created_at'>) {
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guest),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Guest = await res.json()
    setGuests((prev) => [...prev, data])
    return data
  }

  async function updateGuest(id: string, updates: Partial<Omit<Guest, 'id' | 'created_at'>>) {
    const res = await fetch(`/api/guests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Guest = await res.json()
    setGuests((prev) => prev.map((g) => (g.id === id ? data : g)))
    return data
  }

  async function deleteGuest(id: string) {
    const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    setGuests((prev) => prev.filter((g) => g.id !== id))
  }

  return { guests, loading, error, addGuest, updateGuest, deleteGuest, refetch: fetchGuests }
}
