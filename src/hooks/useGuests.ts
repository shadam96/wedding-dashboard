'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest } from '@/types'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setGuests(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  async function addGuest(guest: Omit<Guest, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('guests')
      .insert(guest)
      .select()
      .single()

    if (err) throw err
    setGuests((prev) => [...prev, data])
    return data
  }

  async function updateGuest(id: string, updates: Partial<Omit<Guest, 'id' | 'created_at'>>) {
    const { data, error: err } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    setGuests((prev) => prev.map((g) => (g.id === id ? data : g)))
    return data
  }

  async function deleteGuest(id: string) {
    const { error: err } = await supabase.from('guests').delete().eq('id', id)
    if (err) throw err
    setGuests((prev) => prev.filter((g) => g.id !== id))
  }

  return { guests, loading, error, addGuest, updateGuest, deleteGuest, refetch: fetchGuests }
}
