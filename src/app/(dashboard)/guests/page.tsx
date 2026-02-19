'use client'

import { useState, useMemo } from 'react'
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useGuests } from '@/hooks/useGuests'
import type { Guest } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import GuestStats from '@/components/guests/GuestStats'
import GuestTable from '@/components/guests/GuestTable'
import GuestFormModal from '@/components/guests/GuestFormModal'

export default function GuestsPage() {
  const { guests, loading, addGuest, updateGuest, deleteGuest } = useGuests()
  const [formOpen, setFormOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filteredGuests = useMemo(() => {
    if (!search.trim()) return guests
    const q = search.trim().toLowerCase()
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.plus_one_name && g.plus_one_name.toLowerCase().includes(q)) ||
        (g.phone && g.phone.includes(q)) ||
        (g.notes && g.notes.toLowerCase().includes(q))
    )
  }, [guests, search])

  function handleEdit(guest: Guest) {
    setEditingGuest(guest)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingGuest(null)
  }

  async function handleSubmit(data: Omit<Guest, 'id' | 'created_at'>) {
    if (editingGuest) {
      await updateGuest(editingGuest.id, data)
    } else {
      await addGuest(data)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingGuest) return
    setDeleteLoading(true)
    try {
      await deleteGuest(deletingGuest.id)
      setDeletingGuest(null)
    } finally {
      setDeleteLoading(false)
    }
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
        title="רשימת מוזמנים"
        description="ניהול רשימת המוזמנים לחתונה"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            הוספת מוזמן
          </Button>
        }
      />

      {guests.length > 0 ? (
        <>
          <GuestStats guests={guests} />

          {/* Search bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם, טלפון או הערה..."
              className="w-full ps-4 pe-10 py-2.5 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {search && (
            <p className="text-xs text-warm-500 mb-3">
              נמצאו {filteredGuests.length} מוזמנים מתוך {guests.length}
            </p>
          )}

          <GuestTable guests={filteredGuests} onEdit={handleEdit} onDelete={setDeletingGuest} />
        </>
      ) : (
        <EmptyState
          icon={<UserGroupIcon className="w-12 h-12" />}
          title="אין מוזמנים עדיין"
          description="התחילו להוסיף מוזמנים לרשימה"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="w-4 h-4" />
              הוספת מוזמן
            </Button>
          }
        />
      )}

      <GuestFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        guest={editingGuest}
      />

      <ConfirmDialog
        open={!!deletingGuest}
        onClose={() => setDeletingGuest(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת מוזמן"
        message={`בטוח שרוצים למחוק את ${deletingGuest?.name}?`}
        loading={deleteLoading}
      />
    </>
  )
}
