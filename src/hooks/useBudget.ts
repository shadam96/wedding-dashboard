'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { BudgetItem } from '@/types'

export function useBudget() {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('budget_items')
      .select('*')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem(item: Omit<BudgetItem, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('budget_items')
      .insert(item)
      .select()
      .single()

    if (err) throw err
    setItems((prev) => [...prev, data])
    return data
  }

  async function updateItem(id: string, updates: Partial<Omit<BudgetItem, 'id' | 'created_at'>>) {
    const { data, error: err } = await supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    setItems((prev) => prev.map((i) => (i.id === id ? data : i)))
    return data
  }

  async function deleteItem(id: string) {
    const { error: err } = await supabase.from('budget_items').delete().eq('id', id)
    if (err) throw err
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const totalBudget = items.reduce((sum, i) => sum + Number(i.total_amount), 0)
  const totalPaid = items.reduce((sum, i) => sum + Number(i.paid_amount), 0)
  const totalRemaining = totalBudget - totalPaid

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
    totalBudget,
    totalPaid,
    totalRemaining,
  }
}
