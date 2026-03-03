'use client'

import { PencilIcon, TrashIcon, PhoneIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import type { Bus } from '@/types'

interface BusCardProps {
  bus: Bus
  onEdit: (bus: Bus) => void
  onDelete: (bus: Bus) => void
}

export default function BusCard({ bus, onEdit, onDelete }: BusCardProps) {
  return (
    <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-sm border border-warm-100 dark:border-warm-700 overflow-hidden transition-all">
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-sky-500" />

        <div className="flex-1 p-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <h3 className="font-bold text-warm-900 dark:text-warm-50 text-lg truncate">{bus.label}</h3>
              {bus.location && (
                <div className="flex items-center gap-1 text-sm text-warm-500 dark:text-warm-400 mt-0.5">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{bus.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 text-sm">
            {bus.provider_name && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">ספק</span>
                <p className="font-semibold text-warm-800 dark:text-warm-100">{bus.provider_name}</p>
              </div>
            )}
            {bus.driver_phone && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">טלפון נהג</span>
                <a
                  href={`tel:${bus.driver_phone}`}
                  className="text-rose-500 dark:text-rose-400 font-semibold flex items-center gap-0.5 hover:underline"
                  dir="ltr"
                >
                  <PhoneIcon className="w-3 h-3" />
                  {bus.driver_phone}
                </a>
              </div>
            )}
            {bus.guest_in_charge && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">אורח אחראי</span>
                <div className="flex items-center gap-1 font-semibold text-warm-800 dark:text-warm-100">
                  <UserIcon className="w-3.5 h-3.5" />
                  {bus.guest_in_charge}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {bus.notes && (
            <p className="text-sm text-warm-600 dark:text-warm-300 mb-3 whitespace-pre-line">{bus.notes}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onEdit(bus)}
              className="p-1.5 text-warm-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-warm-50 dark:hover:bg-warm-700 rounded-lg transition"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(bus)}
              className="p-1.5 text-warm-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-warm-50 dark:hover:bg-warm-700 rounded-lg transition"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
