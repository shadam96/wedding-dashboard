'use client'

import type { Task, TaskStatus } from '@/types'
import { STATUS_LABELS } from '@/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done']

const statusIcons: Record<TaskStatus, string> = {
  todo: '📋',
  in_progress: '🔄',
  done: '✅',
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <div className="space-y-4">
      {STATUS_ORDER.map((status) => {
        const statusTasks = tasks.filter((t) => t.status === status)

        return (
          <div key={status} className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 overflow-hidden">
            <div className="px-4 py-3 bg-warm-50 dark:bg-warm-800 border-b border-warm-100 dark:border-warm-700 flex items-center gap-2">
              <span>{statusIcons[status]}</span>
              <h3 className="font-bold text-warm-800 dark:text-warm-200 text-sm">
                {STATUS_LABELS[status]} ({statusTasks.length})
              </h3>
            </div>
            {statusTasks.length > 0 ? (
              statusTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <p className="text-sm text-warm-400 text-center py-4">אין משימות</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
