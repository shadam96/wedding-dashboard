'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Venue } from '@/types'

export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setVenues(
        (data || []).map((v: Record<string, unknown>) => ({
          ...v,
          available_dates: (v.available_dates as string[]) || [],
        })) as Venue[]
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  async function addVenue(venue: Omit<Venue, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('venues')
      .insert(venue)
      .select()
      .single()

    if (err) throw err
    const newVenue = { ...data, available_dates: data.available_dates || [] } as Venue
    setVenues((prev) => [...prev, newVenue])
    return newVenue
  }

  async function updateVenue(id: string, updates: Partial<Omit<Venue, 'id' | 'created_at'>>) {
    const { data, error: err } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    const updated = { ...data, available_dates: data.available_dates || [] } as Venue
    setVenues((prev) => prev.map((v) => (v.id === id ? updated : v)))
    return updated
  }

  async function deleteVenue(id: string) {
    const { error: err } = await supabase.from('venues').delete().eq('id', id)
    if (err) throw err
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
