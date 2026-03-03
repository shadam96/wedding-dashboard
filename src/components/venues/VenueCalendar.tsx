'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Venue } from '@/types'
import { getVenueColor } from '@/types'
import { HEBREW_MONTHS, HEBREW_DAYS, getMonthGrid, formatDateKey } from '@/lib/calendar'
import { useBlockedDates } from '@/hooks/useBlockedDates'

interface VenueCalendarProps {
  venues: Venue[]
  onVenueClick: (venueId: string) => void
}

export default function VenueCalendar({ venues, onVenueClick }: VenueCalendarProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const { value: blockedDates, save: saveBlocked } = useBlockedDates()

  // Drag state
  const dragging = useRef(false)
  const dragMode = useRef<'block' | 'unblock'>('block')
  const pendingBlocked = useRef<Set<string>>(new Set())
  const [, forceRender] = useState(0)

  const blocked = new Set(blockedDates)
  // Merge pending changes during drag
  if (dragging.current) {
    for (const d of pendingBlocked.current) {
      if (dragMode.current === 'block') blocked.add(d)
      else blocked.delete(d)
    }
  }

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

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const today = new Date()
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  function getDateFromPoint(x: number, y: number): string | null {
    const el = document.elementFromPoint(x, y)
    if (!el) return null
    const cell = (el as HTMLElement).closest('[data-date]') as HTMLElement | null
    return cell?.dataset.date || null
  }

  const handlePointerDown = useCallback((e: React.PointerEvent, dateKey: string) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragging.current = true
    const isBlocked = blockedDates.includes(dateKey)
    dragMode.current = isBlocked ? 'unblock' : 'block'
    pendingBlocked.current = new Set([dateKey])
    forceRender((n) => n + 1)
  }, [blockedDates])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dateKey = getDateFromPoint(e.clientX, e.clientY)
    if (dateKey && !pendingBlocked.current.has(dateKey)) {
      pendingBlocked.current.add(dateKey)
      forceRender((n) => n + 1)
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false

    let newBlocked: string[]
    if (dragMode.current === 'block') {
      const set = new Set(blockedDates)
      for (const d of pendingBlocked.current) set.add(d)
      newBlocked = Array.from(set)
    } else {
      newBlocked = blockedDates.filter((d) => !pendingBlocked.current.has(d))
    }
    pendingBlocked.current = new Set()
    saveBlocked(newBlocked)
  }, [blockedDates, saveBlocked])

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
      <div
        className="grid grid-cols-7 gap-1"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {grid.flat().map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }
          const key = formatDateKey(year, month, day)
          const venuesOnDay = dateVenueMap.get(key) || []
          const isToday = key === todayKey
          const isBlocked = blocked.has(key)

          return (
            <div
              key={key}
              data-date={key}
              onPointerDown={(e) => handlePointerDown(e, key)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition relative overflow-hidden select-none touch-none cursor-pointer ${
                isToday
                  ? 'bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-300 dark:ring-rose-700'
                  : venuesOnDay.length > 0
                    ? 'bg-warm-50 dark:bg-warm-700/50'
                    : ''
              }`}
            >
              {isBlocked && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(135deg, transparent, transparent 3px, #ef4444 3px, #ef4444 5px)',
                  }}
                />
              )}
              {isBlocked && (
                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 pointer-events-none" />
              )}
              <span className={`relative z-10 text-xs sm:text-sm ${
                isBlocked
                  ? 'font-semibold text-red-600 dark:text-red-400'
                  : isToday
                    ? 'font-bold text-rose-600 dark:text-rose-400'
                    : 'text-warm-700 dark:text-warm-200'
              }`}>
                {day}
              </span>
              {venuesOnDay.length > 0 && (
                <div className="relative z-10 flex gap-0.5 flex-wrap justify-center max-w-full">
                  {venuesOnDay.map(({ venueId, venueIndex }) => {
                    const color = getVenueColor(venueIndex)
                    return (
                      <span
                        key={venueId}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); onVenueClick(venueId) }}
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
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-warm-100 dark:border-warm-700">
        <div className="flex items-center gap-1.5 text-xs text-warm-600 dark:text-warm-300">
          <span
            className="w-4 h-2.5 rounded-sm border border-red-300 dark:border-red-600"
            style={{
              background: 'repeating-linear-gradient(135deg, transparent, transparent 2px, #ef4444 2px, #ef4444 3px)',
            }}
          />
          תאריכים חסומים (גרור לסימון)
        </div>
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
    </div>
  )
}
