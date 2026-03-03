'use client'

import { useState } from 'react'
import { formatILS } from '@/lib/formatters'

interface BudgetSummaryProps {
  totalBudget: number
  totalPaid: number
  budgetGoal: number
  onBudgetGoalChange: (goal: number) => void
  estimatedGuests: number
}

export default function BudgetSummary({
  totalBudget,
  totalPaid,
  budgetGoal,
  onBudgetGoalChange,
  estimatedGuests,
}: BudgetSummaryProps) {
  const [editing, setEditing] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  const difference = budgetGoal - totalBudget
  const paidPercent = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0
  const pricePerHead = estimatedGuests > 0 ? Math.round(totalBudget / estimatedGuests) : 0

  function startEditing() {
    setGoalInput(budgetGoal > 0 ? String(budgetGoal) : '')
    setEditing(true)
  }

  function commitGoal() {
    const val = Number(goalInput) || 0
    onBudgetGoalChange(val)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitGoal()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Budget Goal */}
      <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-4">
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-1">תקציב</p>
        {editing ? (
          <input
            type="number"
            min="0"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onBlur={commitGoal}
            onKeyDown={handleKeyDown}
            autoFocus
            dir="ltr"
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-rose-400 dark:border-rose-500 text-warm-900 dark:text-warm-100 outline-none"
          />
        ) : (
          <button
            onClick={startEditing}
            className="text-2xl font-bold text-warm-900 dark:text-warm-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="לחצו לעריכה"
          >
            {budgetGoal > 0 ? formatILS(budgetGoal) : 'הגדירו תקציב'}
          </button>
        )}
      </div>

      {/* 2. Actual Cost */}
      <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-4">
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-1">עלות בפועל</p>
        <p className="text-2xl font-bold text-warm-900 dark:text-warm-100">{formatILS(totalBudget)}</p>
      </div>

      {/* 3. Difference */}
      <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-4">
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-1">הפרש</p>
        {budgetGoal > 0 ? (
          <p className={`text-2xl font-bold ${difference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {difference >= 0 ? '+' : ''}{formatILS(difference)}
          </p>
        ) : (
          <p className="text-lg text-warm-400 dark:text-warm-500">—</p>
        )}
      </div>

      {/* 4. Paid */}
      <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-4">
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-1">שולם</p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatILS(totalPaid)}</p>
        <div className="mt-2 w-full bg-warm-100 dark:bg-warm-700 rounded-full h-2">
          <div
            className="bg-emerald-400 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(paidPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-warm-400 mt-1">{paidPercent}% מהעלות</p>
      </div>

      {/* 5. Price Per Head */}
      <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-4">
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-1">מחיר לאורח</p>
        {estimatedGuests > 0 ? (
          <>
            <p className="text-2xl font-bold text-warm-900 dark:text-warm-100">{formatILS(pricePerHead)}</p>
            <p className="text-xs text-warm-400 mt-1">~{estimatedGuests} אורחים צפויים</p>
          </>
        ) : (
          <p className="text-lg text-warm-400 dark:text-warm-500">—</p>
        )}
      </div>
    </div>
  )
}
