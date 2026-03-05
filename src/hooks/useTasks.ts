'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error(await res.text())
      const data: Task[] = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function addTask(task: Omit<Task, 'id' | 'created_at'>) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Task = await res.json()
    setTasks((prev) => [...prev, data])
    return data
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(await res.text())
    const data: Task = await res.json()
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, loading, error, addTask, updateTask, deleteTask, refetch: fetchTasks }
}
