'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BudgetItem } from '@/types'

export function useBudget() {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/budget')
      if (!res.ok) throw new Error(await res.text())
      const data: BudgetItem[] = await res.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budget items')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem(item: Omit<BudgetItem, 'id' | 'created_at'>) {
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: BudgetItem = await res.json()
    setItems((prev) => [...prev, data])
    return data
  }

  async function updateItem(id: string, updates: Partial<Omit<BudgetItem, 'id' | 'created_at'>>) {
    const res = await fetch(`/api/budget/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: BudgetItem = await res.json()
    setItems((prev) => prev.map((i) => (i.id === id ? data : i)))
    return data
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/budget/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
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
