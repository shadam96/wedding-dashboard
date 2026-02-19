import type { BudgetItem } from '@/types'
import { formatILS } from '@/lib/formatters'
import Link from 'next/link'

interface BudgetOverviewProps {
  items: BudgetItem[]
}

export default function BudgetOverview({ items }: BudgetOverviewProps) {
  // Group by category and sum
  const byCategory = items.reduce<Record<string, { total: number; paid: number }>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, paid: 0 }
    }
    acc[item.category].total += Number(item.total_amount)
    acc[item.category].paid += Number(item.paid_amount)
    return acc
  }, {})

  const categories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)

  const grandTotal = items.reduce((s, i) => s + Number(i.total_amount), 0)

  return (
    <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700">
      <div className="px-5 py-4 border-b border-warm-100 dark:border-warm-700 flex items-center justify-between">
        <h3 className="font-bold text-warm-800 dark:text-warm-200">תקציב לפי קטגוריה</h3>
        <Link href="/budget" className="text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition">
          הצג הכל
        </Link>
      </div>
      {categories.length > 0 ? (
        <div className="divide-y divide-warm-100 dark:divide-warm-700">
          {categories.map(([category, data]) => {
            const percent = grandTotal > 0 ? Math.round((data.total / grandTotal) * 100) : 0
            return (
              <div key={category} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-warm-800 dark:text-warm-200">{category}</span>
                  <span className="text-sm text-warm-600 dark:text-warm-400 tabular-nums">{formatILS(data.total)}</span>
                </div>
                <div className="w-full bg-warm-100 dark:bg-warm-700 rounded-full h-1.5">
                  <div
                    className="bg-gold-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-warm-400 text-center py-8">אין פריטי תקציב</p>
      )}
    </div>
  )
}
