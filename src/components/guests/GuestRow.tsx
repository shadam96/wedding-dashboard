'use client'

import type { Guest, Likelihood } from '@/types'
import { getSubgroupLabel } from '@/types'
import StatusDot from '@/components/ui/StatusDot'
import LikelihoodPicker from './LikelihoodPicker'
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline'

interface GuestRowProps {
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (guest: Guest) => void
  onUpdateLikelihood: (guestId: string, likelihood: Likelihood) => void
}

export default function GuestRow({ guest, onEdit, onDelete, onUpdateLikelihood }: GuestRowProps) {
  const children = guest.children || []

  return (
    <tr className="border-b border-warm-100 dark:border-warm-700 hover:bg-warm-50/50 dark:hover:bg-warm-700/30 transition">
      <td className="py-3 ps-3 pe-1 sm:ps-4 sm:pe-2">
        <LikelihoodPicker
          current={guest.likelihood}
          onChange={(v) => onUpdateLikelihood(guest.id, v)}
        />
      </td>
      <td className="py-3 px-1 sm:px-2">
        <div className="font-medium text-warm-900 dark:text-warm-100 text-sm sm:text-base">{guest.name}</div>
        {guest.phone && (
          <div className="text-xs text-warm-400">{guest.phone}</div>
        )}
        {/* Mobile-only: show plus-one & children inline under name */}
        <div className="sm:hidden">
          {guest.has_plus_one && (
            <span className="inline-flex items-center gap-1 text-xs text-gold-600 dark:text-gold-400 mt-0.5">
              <UserPlusIcon className="w-3 h-3" />
              {guest.plus_one_name || '+1'}
              {guest.plus_one_likelihood && <StatusDot likelihood={guest.plus_one_likelihood} />}
            </span>
          )}
          {children.length > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-warm-400 mt-0.5 ms-1"
              title={children.map((c) => `${c.name}${c.under_10 ? ' (מתחת ל-10)' : ''}`).join(', ')}
            >
              {children.length} ילדים
              {children.map((c, i) => (
                <StatusDot key={i} likelihood={c.likelihood} />
              ))}
            </span>
          )}
        </div>
      </td>
      {/* Subgroup — hidden on mobile (already in group header) */}
      <td className="py-3 px-2 hidden sm:table-cell">
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-warm-100 dark:bg-warm-700 text-warm-600 dark:text-warm-300">
          {getSubgroupLabel(guest.subgroup)}
        </span>
      </td>
      {/* Plus-one & children — hidden on mobile (shown under name instead) */}
      <td className="py-3 px-2 hidden sm:table-cell">
        {guest.has_plus_one && (
          <span className="inline-flex items-center gap-1 text-xs text-gold-600 dark:text-gold-400">
            <UserPlusIcon className="w-3.5 h-3.5" />
            {guest.plus_one_name || '+1'}
            {guest.plus_one_likelihood && (
              <StatusDot likelihood={guest.plus_one_likelihood} />
            )}
          </span>
        )}
        {children.length > 0 && (
          <div className="mt-0.5">
            <span
              className="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-warm-400"
              title={children.map((c) => `${c.name}${c.under_10 ? ' (מתחת ל-10)' : ''}`).join(', ')}
            >
              {children.length} ילדים
              {children.map((c, i) => (
                <StatusDot key={i} likelihood={c.likelihood} />
              ))}
            </span>
          </div>
        )}
      </td>
      <td className="py-3 px-2 text-xs text-warm-400 max-w-[150px] truncate hidden md:table-cell">
        {guest.notes}
      </td>
      <td className="py-3 pe-3 ps-1 sm:pe-4 sm:ps-2">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => onEdit(guest)}
            className="p-1 sm:p-1.5 text-warm-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(guest)}
            className="p-1 sm:p-1.5 text-warm-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
