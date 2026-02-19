'use client'

import type { BudgetItem } from '@/types'
import { formatILS } from '@/lib/formatters'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface BudgetRowProps {
  item: BudgetItem
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

export default function BudgetRow({ item, onEdit, onDelete }: BudgetRowProps) {
  const remaining = Number(item.total_amount) - Number(item.paid_amount)

  return (
    <tr className="border-b border-warm-100 dark:border-warm-700 hover:bg-warm-50/50 dark:hover:bg-warm-700/30 transition">
      <td className="py-3 ps-4 pe-2">
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400">
          {item.category}
        </span>
      </td>
      <td className="py-3 px-2 font-medium text-warm-900 dark:text-warm-100">{item.description}</td>
      <td className="py-3 px-2 text-warm-700 dark:text-warm-300 tabular-nums">{formatILS(Number(item.total_amount))}</td>
      <td className="py-3 px-2 text-emerald-600 dark:text-emerald-400 tabular-nums">{formatILS(Number(item.paid_amount))}</td>
      <td className="py-3 px-2 text-rose-600 dark:text-rose-400 tabular-nums">{formatILS(remaining)}</td>
      <td className="py-3 px-2 text-xs text-warm-400 max-w-[120px] truncate">{item.notes}</td>
      <td className="py-3 pe-4 ps-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-warm-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-warm-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
