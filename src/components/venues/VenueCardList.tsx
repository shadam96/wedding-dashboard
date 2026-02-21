'use client'

import type { Venue } from '@/types'
import VenueCard from './VenueCard'

interface VenueCardListProps {
  venues: Venue[]
  onEdit: (venue: Venue) => void
  onDelete: (venue: Venue) => void
}

export default function VenueCardList({ venues, onEdit, onDelete }: VenueCardListProps) {
  return (
    <div className="space-y-4">
      {venues.map((venue, index) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          colorIndex={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
