import type { Task } from '@/types'
import { PRIORITY_LABELS } from '@/types'
import { formatShortDate } from '@/lib/formatters'
import Link from 'next/link'

interface UpcomingTasksProps {
  tasks: Task[]
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const upcoming = tasks
    .filter((t) => t.status !== 'done')
    .slice(0, 5)

  return (
    <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700">
      <div className="px-5 py-4 border-b border-warm-100 dark:border-warm-700 flex items-center justify-between">
        <h3 className="font-bold text-warm-800 dark:text-warm-200">משימות קרובות</h3>
        <Link href="/tasks" className="text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition">
          הצג הכל
        </Link>
      </div>
      {upcoming.length > 0 ? (
        <div className="divide-y divide-warm-100 dark:divide-warm-700">
          {upcoming.map((task) => (
            <div key={task.id} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warm-900 dark:text-warm-100 truncate">{task.title}</p>
                {task.due_date && (
                  <p className="text-xs text-warm-400">{formatShortDate(task.due_date)}</p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${priorityColors[task.priority]}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-warm-400 text-center py-8">אין משימות פתוחות</p>
      )}
    </div>
  )
}
