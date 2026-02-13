'use client'

import type { Task, TaskStatus, TaskOwner } from '@/types'
import { PRIORITY_LABELS, OWNER_LABELS } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { formatShortDate } from '@/lib/formatters'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}

const ownerColors: Record<TaskOwner, string> = {
  suson: 'bg-sky-100 text-sky-700',
  susonit: 'bg-pink-100 text-pink-700',
  both: 'bg-purple-100 text-purple-700',
}

function nextStatus(status: TaskStatus): TaskStatus {
  if (status === 'todo') return 'in_progress'
  if (status === 'in_progress') return 'done'
  return 'todo'
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isDone = task.status === 'done'

  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-warm-100 last:border-0 hover:bg-warm-50/50 transition group">
      <button
        onClick={() => onToggle({ ...task, status: nextStatus(task.status) })}
        className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition ${
          isDone
            ? 'bg-rose-500 border-rose-500 text-white'
            : task.status === 'in_progress'
            ? 'border-rose-300 bg-rose-50'
            : 'border-warm-300'
        }`}
      >
        {isDone && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {task.status === 'in_progress' && (
          <span className="w-2 h-2 rounded-full bg-rose-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isDone ? 'line-through text-warm-400' : 'text-warm-900'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-warm-400 truncate">{task.description}</p>
        )}
      </div>

      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${ownerColors[task.owner]}`}>
        {OWNER_LABELS[task.owner]}
      </span>

      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${priorityColors[task.priority]}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>

      {task.due_date && (
        <span className="text-xs text-warm-400 shrink-0">
          {formatShortDate(task.due_date)}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(task)}
          className="p-1 text-warm-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1 text-warm-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
