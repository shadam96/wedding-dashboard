'use client'

import { useState } from 'react'
import { PlusIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { useBudget } from '@/hooks/useBudget'
import type { BudgetItem } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import BudgetSummary from '@/components/budget/BudgetSummary'
import BudgetTable from '@/components/budget/BudgetTable'
import BudgetFormModal from '@/components/budget/BudgetFormModal'

export default function BudgetPage() {
  const { items, loading, totalBudget, totalPaid, totalRemaining, addItem, updateItem, deleteItem } = useBudget()
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<BudgetItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function handleEdit(item: BudgetItem) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingItem(null)
  }

  async function handleSubmit(data: Omit<BudgetItem, 'id' | 'created_at'>) {
    if (editingItem) {
      await updateItem(editingItem.id, data)
    } else {
      await addItem(data)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return
    setDeleteLoading(true)
    try {
      await deleteItem(deletingItem.id)
      setDeletingItem(null)
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
        title="תקציב"
        description="ניהול תקציב החתונה"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            הוספת פריט
          </Button>
        }
      />

      {items.length > 0 ? (
        <>
          <BudgetSummary
            totalBudget={totalBudget}
            totalPaid={totalPaid}
            totalRemaining={totalRemaining}
          />
          <BudgetTable items={items} onEdit={handleEdit} onDelete={setDeletingItem} />
        </>
      ) : (
        <EmptyState
          icon={<BanknotesIcon className="w-12 h-12" />}
          title="אין פריטי תקציב עדיין"
          description="התחילו להוסיף הוצאות לתקציב"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="w-4 h-4" />
              הוספת פריט
            </Button>
          }
        />
      )}

      <BudgetFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        item={editingItem}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת פריט"
        message={`בטוח שרוצים למחוק את "${deletingItem?.description}"?`}
        loading={deleteLoading}
      />
    </>
  )
}
