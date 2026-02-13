import { formatILS } from '@/lib/formatters'

interface BudgetSummaryProps {
  totalBudget: number
  totalPaid: number
  totalRemaining: number
}

export default function BudgetSummary({ totalBudget, totalPaid, totalRemaining }: BudgetSummaryProps) {
  const paidPercent = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-warm-100 p-4">
        <p className="text-sm text-warm-500 mb-1">תקציב כולל</p>
        <p className="text-2xl font-bold text-warm-900">{formatILS(totalBudget)}</p>
      </div>
      <div className="bg-white rounded-xl border border-warm-100 p-4">
        <p className="text-sm text-warm-500 mb-1">שולם</p>
        <p className="text-2xl font-bold text-emerald-600">{formatILS(totalPaid)}</p>
        <div className="mt-2 w-full bg-warm-100 rounded-full h-2">
          <div
            className="bg-emerald-400 h-2 rounded-full transition-all"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
        <p className="text-xs text-warm-400 mt-1">{paidPercent}% מהתקציב</p>
      </div>
      <div className="bg-white rounded-xl border border-warm-100 p-4">
        <p className="text-sm text-warm-500 mb-1">נותר לתשלום</p>
        <p className="text-2xl font-bold text-rose-600">{formatILS(totalRemaining)}</p>
      </div>
    </div>
  )
}
