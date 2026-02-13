'use client'

import { useState, useEffect } from 'react'
import type { BudgetItem } from '@/types'
import { BUDGET_CATEGORIES } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface BudgetFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<BudgetItem, 'id' | 'created_at'>) => Promise<void>
  item?: BudgetItem | null
}

const emptyForm = {
  category: BUDGET_CATEGORIES[0] as string,
  description: '',
  total_amount: '',
  paid_amount: '',
  notes: '',
}

export default function BudgetFormModal({ open, onClose, onSubmit, item }: BudgetFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        category: item.category,
        description: item.description,
        total_amount: String(item.total_amount),
        paid_amount: String(item.paid_amount),
        notes: item.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [item, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        category: form.category,
        description: form.description,
        total_amount: Number(form.total_amount) || 0,
        paid_amount: Number(form.paid_amount) || 0,
        notes: form.notes || null,
      })
      onClose()
    } catch {
      // error handled by parent
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = BUDGET_CATEGORIES.map((c) => ({ value: c, label: c }))

  return (
    <Modal open={open} onClose={onClose} title={item ? 'עריכת פריט תקציב' : 'הוספת פריט תקציב'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          id="budget-category"
          label="קטגוריה"
          options={categoryOptions}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Input
          id="budget-description"
          label="תיאור"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="budget-total"
            label="סכום כולל (₪)"
            type="number"
            min="0"
            value={form.total_amount}
            onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
            dir="ltr"
            required
          />
          <Input
            id="budget-paid"
            label="שולם (₪)"
            type="number"
            min="0"
            value={form.paid_amount}
            onChange={(e) => setForm({ ...form, paid_amount: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label htmlFor="budget-notes" className="block text-sm font-medium text-warm-700 mb-1">
            הערות
          </label>
          <textarea
            id="budget-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" disabled={loading || !form.description.trim()}>
            {loading ? 'שומר...' : item ? 'עדכון' : 'הוספה'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
