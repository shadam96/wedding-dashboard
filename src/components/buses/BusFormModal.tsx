'use client'

import { useState, useEffect } from 'react'
import type { Bus } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface BusFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Bus, 'id' | 'created_at'>) => Promise<void>
  bus?: Bus | null
}

const emptyForm = {
  label: '',
  location: '',
  provider_name: '',
  driver_phone: '',
  guest_in_charge: '',
  notes: '',
}

export default function BusFormModal({ open, onClose, onSubmit, bus }: BusFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bus) {
      setForm({
        label: bus.label,
        location: bus.location || '',
        provider_name: bus.provider_name || '',
        driver_phone: bus.driver_phone || '',
        guest_in_charge: bus.guest_in_charge || '',
        notes: bus.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [bus, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        label: form.label,
        location: form.location || null,
        provider_name: form.provider_name || null,
        driver_phone: form.driver_phone || null,
        guest_in_charge: form.guest_in_charge || null,
        notes: form.notes || null,
      })
      onClose()
    } catch {
      // error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={bus ? 'עריכת הסעה' : 'הוספת הסעה'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="bus-label"
          label="שם / כינוי"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          required
          autoFocus
          placeholder='לדוגמה: "אוטובוס צפון"'
        />

        <Input
          id="bus-location"
          label="מיקום איסוף"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="כתובת או נקודת ציון"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="bus-provider"
            label="שם ספק"
            value={form.provider_name}
            onChange={(e) => setForm({ ...form, provider_name: e.target.value })}
          />
          <Input
            id="bus-driver-phone"
            label="טלפון נהג"
            type="tel"
            value={form.driver_phone}
            onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
            dir="ltr"
          />
        </div>

        <Input
          id="bus-guest-in-charge"
          label="אורח אחראי"
          value={form.guest_in_charge}
          onChange={(e) => setForm({ ...form, guest_in_charge: e.target.value })}
          placeholder="שם האורח שאחראי על ההסעה"
        />

        <div>
          <label htmlFor="bus-notes" className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
            הערות
          </label>
          <textarea
            id="bus-notes"
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
          <Button type="submit" disabled={loading || !form.label.trim()}>
            {loading ? 'שומר...' : bus ? 'עדכון' : 'הוספה'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
