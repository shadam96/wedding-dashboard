'use client'

import type { BudgetItem } from '@/types'
import BudgetRow from './BudgetRow'

interface BudgetTableProps {
  items: BudgetItem[]
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

export default function BudgetTable({ items, onEdit, onDelete }: BudgetTableProps) {
  return (
    <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-warm-50 dark:bg-warm-800 border-b border-warm-100 dark:border-warm-700">
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 ps-4 pe-2">קטגוריה</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 px-2">תיאור</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 px-2">סכום</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 px-2">שולם</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 px-2">נותר</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 px-2">הערות</th>
            <th className="text-start text-xs font-medium text-warm-500 dark:text-warm-400 py-3 pe-4 ps-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <BudgetRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
