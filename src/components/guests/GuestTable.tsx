'use client'

import { useState } from 'react'
import type { Guest, GuestSide, GuestSubgroup } from '@/types'
import { SIDE_LABELS, SUBGROUP_LABELS } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import GuestRow from './GuestRow'

interface GuestTableProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (guest: Guest) => void
}

const SUBGROUP_ORDER: GuestSubgroup[] = ['family', 'friends', 'work', 'army', 'school', 'other']

export default function GuestTable({ guests, onEdit, onDelete }: GuestTableProps) {
  const sides: GuestSide[] = ['suson', 'susonit']
  const [collapsedSides, setCollapsedSides] = useState<Set<GuestSide>>(new Set())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

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
          <div key={side} className="bg-white rounded-xl border border-warm-100 overflow-hidden overflow-x-auto">
            <button
              onClick={() => toggleSide(side)}
              className="w-full px-4 py-3 bg-warm-50 border-b border-warm-100 flex items-center justify-between hover:bg-warm-100/60 transition cursor-pointer"
            >
              <h3 className="font-bold text-warm-800">
                {SIDE_LABELS[side]} ({sideGuests.length})
              </h3>
              <ChevronDownIcon
                className={`w-4 h-4 text-warm-400 transition-transform ${sideCollapsed ? '-rotate-90' : ''}`}
              />
            </button>

            {!sideCollapsed &&
              SUBGROUP_ORDER.map((subgroup) => {
                const groupGuests = sideGuests.filter((g) => g.subgroup === subgroup)
                if (groupGuests.length === 0) return null
                const groupKey = `${side}-${subgroup}`
                const groupCollapsed = collapsedGroups.has(groupKey)

                return (
                  <div key={subgroup}>
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className="w-full px-4 py-2 bg-warm-50/50 border-b border-warm-100 flex items-center justify-between hover:bg-warm-100/40 transition cursor-pointer"
                    >
                      <span className="text-xs font-medium text-warm-500">
                        {SUBGROUP_LABELS[subgroup]} ({groupGuests.length})
                      </span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 text-warm-300 transition-transform ${groupCollapsed ? '-rotate-90' : ''}`}
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
