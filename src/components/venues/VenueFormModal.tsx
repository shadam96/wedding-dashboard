'use client'

import { useState, useEffect } from 'react'
import type { Venue, VenueStatus } from '@/types'
import { VENUE_STATUS_LABELS } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import DatePicker from './DatePicker'

interface VenueFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Venue, 'id' | 'created_at'>) => Promise<void>
  venue?: Venue | null
}

const emptyForm = {
  name: '',
  location: '',
  min_price: '',
  max_price: '',
  capacity: '',
  contact_name: '',
  contact_phone: '',
  status: 'considering' as VenueStatus,
  available_dates: [] as string[],
  notes: '',
}

export default function VenueFormModal({ open, onClose, onSubmit, venue }: VenueFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (venue) {
      setForm({
        name: venue.name,
        location: venue.location || '',
        min_price: String(venue.min_price || ''),
        max_price: String(venue.max_price || ''),
        capacity: venue.capacity ? String(venue.capacity) : '',
        contact_name: venue.contact_name || '',
        contact_phone: venue.contact_phone || '',
        status: venue.status,
        available_dates: venue.available_dates || [],
        notes: venue.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [venue, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        name: form.name.trim(),
        location: form.location.trim() || null,
        min_price: Number(form.min_price) || 0,
        max_price: Number(form.max_price) || 0,
        capacity: form.capacity ? Number(form.capacity) : null,
        contact_name: form.contact_name.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        status: form.status,
        available_dates: form.available_dates,
        notes: form.notes.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = (Object.entries(VENUE_STATUS_LABELS) as [VenueStatus, string][]).map(
    ([value, label]) => ({ value, label })
  )

  return (
    <Modal open={open} onClose={onClose} title={venue ? 'עריכת מקום' : 'הוספת מקום'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <Input
          id="venue-name"
          label="שם המקום"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          autoFocus
        />

        <Input
          id="venue-location"
          label="מיקום"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="venue-min-price"
            label="מחיר מינימום (₪)"
            type="number"
            min="0"
            value={form.min_price}
            onChange={(e) => setForm({ ...form, min_price: e.target.value })}
            dir="ltr"
          />
          <Input
            id="venue-max-price"
            label="מחיר מקסימום (₪)"
            type="number"
            min="0"
            value={form.max_price}
            onChange={(e) => setForm({ ...form, max_price: e.target.value })}
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="venue-capacity"
            label="קיבולת"
            type="number"
            min="0"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            dir="ltr"
          />
          <Select
            id="venue-status"
            label="סטטוס"
            options={statusOptions}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as VenueStatus })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="venue-contact-name"
            label="איש קשר"
            value={form.contact_name}
            onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
          />
          <Input
            id="venue-contact-phone"
            label="טלפון"
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            dir="ltr"
          />
        </div>

        <DatePicker
          selectedDates={form.available_dates}
          onChange={(dates) => setForm({ ...form, available_dates: dates })}
        />

        <div>
          <label htmlFor="venue-notes" className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
            הערות
          </label>
          <textarea
            id="venue-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" disabled={loading || !form.name.trim()}>
            {loading ? 'שומר...' : venue ? 'עדכון' : 'הוספה'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
