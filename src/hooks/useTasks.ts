'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function addTask(task: Omit<Task, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (err) throw err
    setTasks((prev) => [...prev, data])
    return data
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>) {
    const { data, error: err } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  async function deleteTask(id: string) {
    const { error: err } = await supabase.from('tasks').delete().eq('id', id)
    if (err) throw err
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, loading, error, addTask, updateTask, deleteTask, refetch: fetchTasks }
}
