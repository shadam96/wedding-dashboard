'use client'

import { MapPinIcon, PencilIcon, TrashIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import type { Venue } from '@/types'
import { VENUE_STATUS_LABELS, getVenueColor } from '@/types'
import { formatILS, formatShortDate } from '@/lib/formatters'

interface VenueCardProps {
  venue: Venue
  colorIndex: number
  onEdit: (venue: Venue) => void
  onDelete: (venue: Venue) => void
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  considering: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  visited: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  booked: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  rejected: 'bg-warm-100 text-warm-500 dark:bg-warm-700 dark:text-warm-400',
}

export default function VenueCard({ venue, colorIndex, onEdit, onDelete }: VenueCardProps) {
  const color = getVenueColor(colorIndex)
  const hasPriceRange = venue.min_price > 0 || venue.max_price > 0
  const isBooked = venue.status === 'booked'
  const isRejected = venue.status === 'rejected'

  return (
    <div
      id={`venue-${venue.id}`}
      className={`bg-white dark:bg-warm-800 rounded-2xl shadow-sm border overflow-hidden transition-all ${
        isBooked
          ? 'border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-200 dark:ring-emerald-800'
          : 'border-warm-100 dark:border-warm-700'
      } ${isRejected ? 'opacity-60' : ''}`}
    >
      <div className="flex">
        {/* Color bar */}
        <div className={`w-1.5 shrink-0 ${color.dot}`} />

        <div className="flex-1 p-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <h3 className="font-bold text-warm-900 dark:text-warm-50 text-lg truncate">{venue.name}</h3>
              {venue.location && (
                <div className="flex items-center gap-1 text-sm text-warm-500 dark:text-warm-400 mt-0.5">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{venue.location}</span>
                </div>
              )}
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE_CLASSES[venue.status] || ''}`}>
              {VENUE_STATUS_LABELS[venue.status]}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 text-sm">
            {hasPriceRange && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">טווח מחירים</span>
                <p className="font-semibold text-warm-800 dark:text-warm-100" dir="ltr">
                  {venue.min_price > 0 && venue.max_price > 0
                    ? `${formatILS(venue.min_price)} – ${formatILS(venue.max_price)}`
                    : formatILS(venue.min_price || venue.max_price)}
                </p>
              </div>
            )}
            {venue.capacity && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">קיבולת</span>
                <div className="flex items-center gap-1 font-semibold text-warm-800 dark:text-warm-100">
                  <UserGroupIcon className="w-3.5 h-3.5" />
                  {venue.capacity}
                </div>
              </div>
            )}
            {venue.contact_name && (
              <div>
                <span className="text-warm-500 dark:text-warm-400 text-xs">איש קשר</span>
                <p className="font-semibold text-warm-800 dark:text-warm-100">{venue.contact_name}</p>
                {venue.contact_phone && (
                  <a href={`tel:${venue.contact_phone}`} className="text-rose-500 dark:text-rose-400 text-xs flex items-center gap-0.5 hover:underline" dir="ltr">
                    <PhoneIcon className="w-3 h-3" />
                    {venue.contact_phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Available dates */}
          {venue.available_dates.length > 0 && (
            <div className="mb-3">
              <span className="text-warm-500 dark:text-warm-400 text-xs block mb-1">תאריכים פנויים</span>
              <div className="flex flex-wrap gap-1.5">
                {venue.available_dates.map((date) => (
                  <span
                    key={date}
                    className={`text-xs px-2 py-0.5 rounded-full ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`}
                  >
                    {formatShortDate(date)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {venue.notes && (
            <p className="text-sm text-warm-600 dark:text-warm-300 mb-3 whitespace-pre-line">{venue.notes}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onEdit(venue)}
              className="p-1.5 text-warm-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-warm-50 dark:hover:bg-warm-700 rounded-lg transition"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(venue)}
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
