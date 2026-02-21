'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Venue } from '@/types'
import { getVenueColor } from '@/types'
import { HEBREW_MONTHS, HEBREW_DAYS, getMonthGrid, formatDateKey } from '@/lib/calendar'

interface VenueCalendarProps {
  venues: Venue[]
  onVenueClick: (venueId: string) => void
}

export default function VenueCalendar({ venues, onVenueClick }: VenueCalendarProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const grid = getMonthGrid(year, month)

  // Build date → venue mapping
  const dateVenueMap = new Map<string, { venueId: string; venueIndex: number }[]>()
  venues.forEach((venue, venueIndex) => {
    for (const date of venue.available_dates) {
      const existing = dateVenueMap.get(date) || []
      existing.push({ venueId: venue.id, venueIndex })
      dateVenueMap.set(date, existing)
    }
  })

  // RTL: ChevronRight = prev (visually left arrow points right in RTL = going back)
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

  const today = new Date()
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-sm border border-warm-100 dark:border-warm-700 p-4 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-warm-100 dark:hover:bg-warm-700 rounded-xl transition"
        >
          <ChevronRightIcon className="w-5 h-5 text-warm-600 dark:text-warm-300" />
        </button>
        <h3 className="text-lg font-bold text-warm-900 dark:text-warm-50">
          {HEBREW_MONTHS[month]} {year}
        </h3>
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-warm-100 dark:hover:bg-warm-700 rounded-xl transition"
        >
          <ChevronLeftIcon className="w-5 h-5 text-warm-600 dark:text-warm-300" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {HEBREW_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-warm-500 dark:text-warm-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.flat().map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }
          const key = formatDateKey(year, month, day)
          const venuesOnDay = dateVenueMap.get(key) || []
          const isToday = key === todayKey

          return (
            <div
              key={key}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition ${
                isToday
                  ? 'bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-300 dark:ring-rose-700'
                  : venuesOnDay.length > 0
                    ? 'bg-warm-50 dark:bg-warm-700/50'
                    : ''
              }`}
            >
              <span className={`text-xs sm:text-sm ${isToday ? 'font-bold text-rose-600 dark:text-rose-400' : 'text-warm-700 dark:text-warm-200'}`}>
                {day}
              </span>
              {venuesOnDay.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center max-w-full">
                  {venuesOnDay.map(({ venueId, venueIndex }) => {
                    const color = getVenueColor(venueIndex)
                    return (
                      <span
                        key={venueId}
                        role="button"
                        tabIndex={0}
                        onClick={() => onVenueClick(venueId)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onVenueClick(venueId) }}
                        className={`inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 rounded-full ${color.dot} cursor-pointer hover:scale-125 transition-transform`}
                        title={venues.find((v) => v.id === venueId)?.name}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {venues.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-warm-100 dark:border-warm-700">
          {venues.map((venue, index) => {
            const color = getVenueColor(index)
            return (
              <button
                key={venue.id}
                onClick={() => onVenueClick(venue.id)}
                className="flex items-center gap-1.5 text-xs text-warm-600 dark:text-warm-300 hover:text-warm-900 dark:hover:text-warm-50 transition"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                {venue.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
