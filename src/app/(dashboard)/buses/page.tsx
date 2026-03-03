'use client'

import { useState } from 'react'
import { PlusIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useBuses } from '@/hooks/useBuses'
import type { Bus } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import BusCard from '@/components/buses/BusCard'
import BusFormModal from '@/components/buses/BusFormModal'

export default function BusesPage() {
  const { buses, loading, addBus, updateBus, deleteBus } = useBuses()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [deletingBus, setDeletingBus] = useState<Bus | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function handleEdit(bus: Bus) {
    setEditingBus(bus)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingBus(null)
  }

  async function handleSubmit(data: Omit<Bus, 'id' | 'created_at'>) {
    if (editingBus) {
      await updateBus(editingBus.id, data)
    } else {
      await addBus(data)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingBus) return
    setDeleteLoading(true)
    try {
      await deleteBus(deletingBus.id)
      setDeletingBus(null)
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
        title="הסעות"
        description="ניהול אוטובוסים והסעות לאירוע"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            הוספת הסעה
          </Button>
        }
      />

      {buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} onEdit={handleEdit} onDelete={setDeletingBus} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<TruckIcon className="w-12 h-12" />}
          title="אין הסעות עדיין"
          description="התחילו להוסיף אוטובוסים והסעות"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="w-4 h-4" />
              הוספת הסעה
            </Button>
          }
        />
      )}

      <BusFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        bus={editingBus}
      />

      <ConfirmDialog
        open={!!deletingBus}
        onClose={() => setDeletingBus(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת הסעה"
        message={`בטוח שרוצים למחוק את "${deletingBus?.label}"?`}
        loading={deleteLoading}
      />
    </>
  )
}
