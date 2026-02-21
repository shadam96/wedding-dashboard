'use client'

import { useState, useMemo } from 'react'
import type { Guest, GuestSide, Likelihood } from '@/types'
import { SIDE_LABELS, DEFAULT_SUBGROUPS, getSubgroupLabel } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import GuestRow from './GuestRow'

interface GuestTableProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (guest: Guest) => void
  onUpdateLikelihood: (guestId: string, likelihood: Likelihood) => void
}

function headcount(list: Guest[]): number {
  return list.reduce((sum, g) => {
    return sum + 1 + (g.has_plus_one ? 1 : 0) + (g.children || []).length
  }, 0)
}

export default function GuestTable({ guests, onEdit, onDelete, onUpdateLikelihood }: GuestTableProps) {
  const sides: GuestSide[] = ['suson', 'susonit']
  const [collapsedSides, setCollapsedSides] = useState<Set<GuestSide>>(new Set())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const subgroupOrder = useMemo(() => {
    const customSubgroups = new Set<string>()
    for (const g of guests) {
      if (!(DEFAULT_SUBGROUPS as readonly string[]).includes(g.subgroup)) {
        customSubgroups.add(g.subgroup)
      }
    }
    const sorted = [...customSubgroups].sort((a, b) => a.localeCompare(b, 'he'))
    return [...DEFAULT_SUBGROUPS, ...sorted]
  }, [guests])

  function toggleSide(side: GuestSide) {
    setCollapsedSides((prev) => {
      const next = new Set(prev)
      if (next.has(side)) next.delete(side)
      else next.add(side)
      return next
    })
  }

  function toggleGroup(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {sides.map((side) => {
        const sideGuests = guests.filter((g) => g.side === side)
        if (sideGuests.length === 0) return null
        const sideCollapsed = collapsedSides.has(side)

        return (
          <div key={side} className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 overflow-hidden overflow-x-auto">
            <button
              onClick={() => toggleSide(side)}
              className="w-full px-4 py-3 bg-warm-50 dark:bg-warm-800 border-b border-warm-100 dark:border-warm-700 flex items-center justify-between hover:bg-warm-100/60 dark:hover:bg-warm-700/60 transition cursor-pointer"
            >
              <h3 className="font-bold text-warm-800 dark:text-warm-200">
                {SIDE_LABELS[side]} ({headcount(sideGuests)})
              </h3>
              <ChevronDownIcon
                className={`w-4 h-4 text-warm-400 transition-transform ${sideCollapsed ? '-rotate-90' : ''}`}
              />
            </button>

            {!sideCollapsed &&
              subgroupOrder.map((subgroup) => {
                const groupGuests = sideGuests.filter((g) => g.subgroup === subgroup)
                if (groupGuests.length === 0) return null
                const groupKey = `${side}-${subgroup}`
                const groupCollapsed = collapsedGroups.has(groupKey)

                return (
                  <div key={subgroup}>
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className="w-full px-4 py-2 bg-warm-50/50 dark:bg-warm-700/30 border-b border-warm-100 dark:border-warm-700 flex items-center justify-between hover:bg-warm-100/40 dark:hover:bg-warm-700/50 transition cursor-pointer"
                    >
                      <span className="text-xs font-medium text-warm-500 dark:text-warm-400">
                        {getSubgroupLabel(subgroup)} ({headcount(groupGuests)})
                      </span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 text-warm-300 dark:text-warm-500 transition-transform ${groupCollapsed ? '-rotate-90' : ''}`}
                      />
                    </button>
                    {!groupCollapsed && (
                      <table className="w-full">
                        <tbody>
                          {groupGuests.map((guest) => (
                            <GuestRow
                              key={guest.id}
                              guest={guest}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onUpdateLikelihood={onUpdateLikelihood}
                            />
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
