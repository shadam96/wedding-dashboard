'use client'

import { useState } from 'react'
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { useTasks } from '@/hooks/useTasks'
import type { Task } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import TaskList from '@/components/tasks/TaskList'
import TaskFormModal from '@/components/tasks/TaskFormModal'

export default function TasksPage() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function handleEdit(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingTask(null)
  }

  async function handleSubmit(data: Omit<Task, 'id' | 'created_at'>) {
    if (editingTask) {
      await updateTask(editingTask.id, data)
    } else {
      await addTask(data)
    }
  }

  async function handleToggle(task: Task) {
    await updateTask(task.id, { status: task.status })
  }

  async function handleConfirmDelete() {
    if (!deletingTask) return
    setDeleteLoading(true)
    try {
      await deleteTask(deletingTask.id)
      setDeletingTask(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="משימות"
        description="ניהול משימות לקראת החתונה"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            הוספת משימה
          </Button>
        }
      />

      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onToggle={handleToggle} onEdit={handleEdit} onDelete={setDeletingTask} />
      ) : (
        <EmptyState
          icon={<ClipboardDocumentListIcon className="w-12 h-12" />}
          title="אין משימות עדיין"
          description="התחילו להוסיף משימות"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="w-4 h-4" />
              הוספת משימה
            </Button>
          }
        />
      )}

      <TaskFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        task={editingTask}
      />

      <ConfirmDialog
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת משימה"
        message={`בטוח שרוצים למחוק את "${deletingTask?.title}"?`}
        loading={deleteLoading}
      />
    </>
  )
}
