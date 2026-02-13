'use client'

import { useState, useEffect } from 'react'
import type { Guest, GuestSide, GuestSubgroup, Likelihood } from '@/types'
import { SIDE_LABELS, SUBGROUP_LABELS, LIKELIHOOD_LABELS } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface GuestFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Guest, 'id' | 'created_at'>) => Promise<void>
  guest?: Guest | null
}

const emptyForm = {
  name: '',
  side: 'suson' as GuestSide,
  subgroup: 'family' as GuestSubgroup,
  likelihood: 'green' as Likelihood,
  has_plus_one: false,
  plus_one_name: '',
  phone: '',
  notes: '',
}

export default function GuestFormModal({ open, onClose, onSubmit, guest }: GuestFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (guest) {
      setForm({
        name: guest.name,
        side: guest.side,
        subgroup: guest.subgroup,
        likelihood: guest.likelihood,
        has_plus_one: guest.has_plus_one,
        plus_one_name: guest.plus_one_name || '',
        phone: guest.phone || '',
        notes: guest.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [guest, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        plus_one_name: form.plus_one_name || null,
        phone: form.phone || null,
        notes: form.notes || null,
      })
      onClose()
    } catch {
      // error handled by parent
    } finally {
      setLoading(false)
    }
  }

  const sideOptions = (Object.keys(SIDE_LABELS) as GuestSide[]).map((k) => ({
    value: k,
    label: SIDE_LABELS[k],
  }))

  const subgroupOptions = (Object.keys(SUBGROUP_LABELS) as GuestSubgroup[]).map((k) => ({
    value: k,
    label: SUBGROUP_LABELS[k],
  }))

  const likelihoodOptions = (Object.keys(LIKELIHOOD_LABELS) as Likelihood[]).map((k) => ({
    value: k,
    label: LIKELIHOOD_LABELS[k],
  }))

  return (
    <Modal open={open} onClose={onClose} title={guest ? 'עריכת מוזמן' : 'הוספת מוזמן'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="guest-name"
          label="שם"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="guest-side"
            label="צד"
            options={sideOptions}
            value={form.side}
            onChange={(e) => setForm({ ...form, side: e.target.value as GuestSide })}
          />
          <Select
            id="guest-subgroup"
            label="קבוצה"
            options={subgroupOptions}
            value={form.subgroup}
            onChange={(e) => setForm({ ...form, subgroup: e.target.value as GuestSubgroup })}
          />
        </div>

        <Select
          id="guest-likelihood"
          label="סבירות הגעה"
          options={likelihoodOptions}
          value={form.likelihood}
          onChange={(e) => setForm({ ...form, likelihood: e.target.value as Likelihood })}
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.has_plus_one}
              onChange={(e) => setForm({ ...form, has_plus_one: e.target.checked })}
              className="w-4 h-4 rounded border-warm-300 text-rose-500 focus:ring-rose-300"
            />
            <span className="text-sm text-warm-700">מגיע/ה עם פלוס אחד</span>
          </label>
        </div>

        {form.has_plus_one && (
          <Input
            id="guest-plus-one"
            label="שם הפלוס אחד"
            value={form.plus_one_name}
            onChange={(e) => setForm({ ...form, plus_one_name: e.target.value })}
          />
        )}

        <Input
          id="guest-phone"
          label="טלפון"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          type="tel"
          dir="ltr"
        />

        <div>
          <label htmlFor="guest-notes" className="block text-sm font-medium text-warm-700 mb-1">
            הערות
          </label>
          <textarea
            id="guest-notes"
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
          <Button type="submit" disabled={loading || !form.name.trim()}>
            {loading ? 'שומר...' : guest ? 'עדכון' : 'הוספה'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
