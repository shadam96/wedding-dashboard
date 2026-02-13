'use client'

import { useState, useEffect } from 'react'
import type { Task, TaskStatus, TaskPriority, TaskOwner } from '@/types'
import { STATUS_LABELS, PRIORITY_LABELS, OWNER_LABELS } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface TaskFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Task, 'id' | 'created_at'>) => Promise<void>
  task?: Task | null
}

const emptyForm = {
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  owner: 'both' as TaskOwner,
  due_date: '',
}

export default function TaskFormModal({ open, onClose, onSubmit, task }: TaskFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        owner: task.owner,
        due_date: task.due_date || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [task, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        description: form.description || null,
        due_date: form.due_date || null,
      })
      onClose()
    } catch {
      // error handled by parent
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = (Object.keys(STATUS_LABELS) as TaskStatus[]).map((k) => ({
    value: k,
    label: STATUS_LABELS[k],
  }))

  const priorityOptions = (Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((k) => ({
    value: k,
    label: PRIORITY_LABELS[k],
  }))

  const ownerOptions = (Object.keys(OWNER_LABELS) as TaskOwner[]).map((k) => ({
    value: k,
    label: OWNER_LABELS[k],
  }))

  return (
    <Modal open={open} onClose={onClose} title={task ? 'עריכת משימה' : 'הוספת משימה'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="task-title"
          label="כותרת"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          autoFocus
        />

        <div>
          <label htmlFor="task-desc" className="block text-sm font-medium text-warm-700 mb-1">
            תיאור
          </label>
          <textarea
            id="task-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            id="task-status"
            label="סטטוס"
            options={statusOptions}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
          />
          <Select
            id="task-priority"
            label="עדיפות"
            options={priorityOptions}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
          />
        </div>

        <Select
          id="task-owner"
          label="אחראי/ת"
          options={ownerOptions}
          value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value as TaskOwner })}
        />

        <Input
          id="task-due"
          label="תאריך יעד"
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          dir="ltr"
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" disabled={loading || !form.title.trim()}>
            {loading ? 'שומר...' : task ? 'עדכון' : 'הוספה'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
