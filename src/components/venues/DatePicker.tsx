'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HEBREW_MONTHS, HEBREW_DAYS, getMonthGrid, formatDateKey } from '@/lib/calendar'

interface DatePickerProps {
  selectedDates: string[]
  onChange: (dates: string[]) => void
}

export default function DatePicker({ selectedDates, onChange }: DatePickerProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const grid = getMonthGrid(year, month)

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function toggleDate(day: number) {
    const key = formatDateKey(year, month, day)
    if (selectedDates.includes(key)) {
      onChange(selectedDates.filter((d) => d !== key))
    } else {
      onChange([...selectedDates, key].sort())
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
        תאריכים פנויים
      </label>
      <div className="border border-warm-200 dark:border-warm-600 rounded-xl p-3 bg-white dark:bg-warm-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={nextMonth} className="p-1 hover:bg-warm-100 dark:hover:bg-warm-600 rounded-lg transition">
            <ChevronRightIcon className="w-4 h-4 text-warm-600 dark:text-warm-300" />
          </button>
          <span className="text-sm font-semibold text-warm-800 dark:text-warm-100">
            {HEBREW_MONTHS[month]} {year}
          </span>
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-warm-100 dark:hover:bg-warm-600 rounded-lg transition">
            <ChevronLeftIcon className="w-4 h-4 text-warm-600 dark:text-warm-300" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {HEBREW_DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-warm-500 dark:text-warm-400 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {grid.flat().map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} />
            }
            const key = formatDateKey(year, month, day)
            const isSelected = selectedDates.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDate(day)}
                className={`text-xs py-1.5 rounded-lg transition font-medium ${
                  isSelected
                    ? 'bg-rose-500 text-white'
                    : 'text-warm-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-600'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Count */}
        {selectedDates.length > 0 && (
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 text-center">
            {selectedDates.length} תאריכים נבחרו
          </p>
        )}
      </div>
    </div>
  )
}
