'use client'

import {
  UserGroupIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { useDashboard } from '@/hooks/useDashboard'
import { formatILS } from '@/lib/formatters'
import PageHeader from '@/components/layout/PageHeader'
import SummaryCard from '@/components/dashboard/SummaryCard'
import UpcomingTasks from '@/components/dashboard/UpcomingTasks'
import BudgetOverview from '@/components/dashboard/BudgetOverview'

// Set your wedding date here
const WEDDING_DATE = '2026-09-01'

function daysUntilWedding(): number {
  const target = new Date(WEDDING_DATE)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const { guests, tasks, budgetItems, loading } = useDashboard()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  const plusOnes = guests.filter((g) => g.has_plus_one).length
  const childrenCount = guests.reduce((s, g) => s + (g.children || []).length, 0)
  const totalGuests = guests.length + plusOnes + childrenCount
  const totalBudget = budgetItems.reduce((s, i) => s + Number(i.total_amount), 0)
  const openTasks = tasks.filter((t) => t.status !== 'done').length
  const days = daysUntilWedding()

  return (
    <>
      <PageHeader title="דשבורד" description="סקירה כללית של החתונה" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="סה״כ מוזמנים"
          value={totalGuests}
          subtitle={`${guests.length} מוזמנים + ${plusOnes} פלוסים${childrenCount > 0 ? ` + ${childrenCount} ילדים` : ''}`}
          icon={<UserGroupIcon className="w-5 h-5" />}
          color="rose"
        />
        <SummaryCard
          title="תקציב כולל"
          value={formatILS(totalBudget)}
          icon={<BanknotesIcon className="w-5 h-5" />}
          color="gold"
        />
        <SummaryCard
          title="משימות פתוחות"
          value={openTasks}
          subtitle={`מתוך ${tasks.length}`}
          icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
          color="blue"
        />
        <SummaryCard
          title="ימים לחתונה"
          value={days}
          icon={<CalendarDaysIcon className="w-5 h-5" />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={tasks} />
        <BudgetOverview items={budgetItems} />
      </div>
    </>
  )
}
