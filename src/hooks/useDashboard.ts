'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest, Task, BudgetItem } from '@/types'

interface DashboardData {
  guests: Guest[]
  tasks: Task[]
  budgetItems: BudgetItem[]
  loading: boolean
}

export function useDashboard(): DashboardData {
  const [guests, setGuests] = useState<Guest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const [guestsRes, tasksRes, budgetRes] = await Promise.all([
        supabase.from('guests').select('*'),
        supabase.from('tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('budget_items').select('*'),
      ])

      setGuests(guestsRes.data || [])
      setTasks(tasksRes.data || [])
      setBudgetItems(budgetRes.data || [])
      setLoading(false)
    }

    fetchAll()
  }, [])

  return { guests, tasks, budgetItems, loading }
}
