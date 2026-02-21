'use client'

import { useState } from 'react'
import { PlusIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useVenues } from '@/hooks/useVenues'
import type { Venue } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import VenueCalendar from '@/components/venues/VenueCalendar'
import VenueCardList from '@/components/venues/VenueCardList'
import VenueFormModal from '@/components/venues/VenueFormModal'

export default function VenuesPage() {
  const { venues, loading, addVenue, updateVenue, deleteVenue } = useVenues()
  const [formOpen, setFormOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function handleEdit(venue: Venue) {
    setEditingVenue(venue)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingVenue(null)
  }

  async function handleSubmit(data: Omit<Venue, 'id' | 'created_at'>) {
    if (editingVenue) {
      await updateVenue(editingVenue.id, data)
    } else {
      await addVenue(data)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingVenue) return
    setDeleteLoading(true)
    try {
      await deleteVenue(deletingVenue.id)
      setDeletingVenue(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleVenueClick(venueId: string) {
    const el = document.getElementById(`venue-${venueId}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('ring-2', 'ring-rose-400', 'dark:ring-rose-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-rose-400', 'dark:ring-rose-500')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="מקומות"
        description="השוואת מקומות לאירוע"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            הוספת מקום
          </Button>
        }
      />

      {venues.length > 0 ? (
        <>
          <VenueCalendar venues={venues} onVenueClick={handleVenueClick} />
          <VenueCardList venues={venues} onEdit={handleEdit} onDelete={setDeletingVenue} />
        </>
      ) : (
        <EmptyState
          icon={<MapPinIcon className="w-12 h-12" />}
          title="אין מקומות עדיין"
          description="התחילו להוסיף מקומות לאירוע"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="w-4 h-4" />
              הוספת מקום
            </Button>
          }
        />
      )}

      <VenueFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        venue={editingVenue}
      />

      <ConfirmDialog
        open={!!deletingVenue}
        onClose={() => setDeletingVenue(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת מקום"
        message={`בטוח שרוצים למחוק את "${deletingVenue?.name}"?`}
        loading={deleteLoading}
      />
    </>
  )
}
