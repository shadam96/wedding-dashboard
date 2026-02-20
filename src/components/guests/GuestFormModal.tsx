'use client'

import { useState, useEffect } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import type { Guest, GuestSide, Likelihood, GuestChild } from '@/types'
import { SIDE_LABELS, SUBGROUP_LABELS, LIKELIHOOD_LABELS, DEFAULT_SUBGROUPS, getSubgroupLabel } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { PlusIcon, XMarkIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/outline'

interface GuestFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Guest, 'id' | 'created_at'>) => Promise<void>
  guest?: Guest | null
  existingSubgroups: string[]
  onDeleteSubgroup: (subgroup: string) => Promise<void>
}

const ADD_NEW_SENTINEL = '__add_new__'

const emptyForm = {
  name: '',
  side: 'suson' as GuestSide,
  subgroup: 'family' as string,
  likelihood: 'green' as Likelihood,
  has_plus_one: false,
  plus_one_name: '',
  plus_one_likelihood: 'green' as Likelihood,
  children: [] as GuestChild[],
  phone: '',
  notes: '',
}

export default function GuestFormModal({ open, onClose, onSubmit, guest, existingSubgroups, onDeleteSubgroup }: GuestFormModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customSubgroup, setCustomSubgroup] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    if (guest) {
      const isCustom = !(DEFAULT_SUBGROUPS as readonly string[]).includes(guest.subgroup)
      setForm({
        name: guest.name,
        side: guest.side,
        subgroup: isCustom ? guest.subgroup : guest.subgroup,
        likelihood: guest.likelihood,
        has_plus_one: guest.has_plus_one,
        plus_one_name: guest.plus_one_name || '',
        plus_one_likelihood: guest.plus_one_likelihood || 'green',
        children: guest.children || [],
        phone: guest.phone || '',
        notes: guest.notes || '',
      })
      setShowCustomInput(isCustom)
      setCustomSubgroup(isCustom ? guest.subgroup : '')
    } else {
      setForm(emptyForm)
      setShowCustomInput(false)
      setCustomSubgroup('')
    }
    setError(null)
  }, [guest, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const finalSubgroup = showCustomInput ? customSubgroup.trim() : form.subgroup
      const filteredChildren = form.children.filter((c) => c.name.trim())
      await onSubmit({
        ...form,
        subgroup: finalSubgroup || 'other',
        plus_one_name: form.plus_one_name || null,
        plus_one_likelihood: form.has_plus_one ? form.plus_one_likelihood : null,
        children: filteredChildren,
        phone: form.phone || null,
        notes: form.notes || null,
      })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'שגיאה בשמירה'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const sideOptions = (Object.keys(SIDE_LABELS) as GuestSide[]).map((k) => ({
    value: k,
    label: SIDE_LABELS[k],
  }))

  // Build subgroup options: defaults + existing custom + "add new" sentinel
  const subgroupOptions = (() => {
    const opts: { value: string; label: string }[] = DEFAULT_SUBGROUPS.map((k) => ({
      value: k,
      label: SUBGROUP_LABELS[k],
    }))
    // Add existing custom subgroups
    for (const sg of existingSubgroups) {
      if (!(DEFAULT_SUBGROUPS as readonly string[]).includes(sg)) {
        opts.push({ value: sg, label: sg })
      }
    }
    opts.push({ value: ADD_NEW_SENTINEL, label: '+ הוספת קבוצה חדשה...' })
    return opts
  })()

  const likelihoodOptions = (Object.keys(LIKELIHOOD_LABELS) as Likelihood[]).map((k) => ({
    value: k,
    label: LIKELIHOOD_LABELS[k],
  }))

  function handleSubgroupChange(value: string) {
    if (value === ADD_NEW_SENTINEL) {
      setShowCustomInput(true)
      setCustomSubgroup('')
    } else {
      setShowCustomInput(false)
      setCustomSubgroup('')
      setForm({ ...form, subgroup: value })
    }
  }

  function addChild() {
    setForm({
      ...form,
      children: [...form.children, { name: '', under_10: false, likelihood: 'green' }],
    })
  }

  function updateChild(index: number, updates: Partial<GuestChild>) {
    const updated = form.children.map((c, i) => (i === index ? { ...c, ...updates } : c))
    setForm({ ...form, children: updated })
  }

  function removeChild(index: number) {
    setForm({ ...form, children: form.children.filter((_, i) => i !== index) })
  }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            id="guest-side"
            label="צד"
            options={sideOptions}
            value={form.side}
            onChange={(e) => setForm({ ...form, side: e.target.value as GuestSide })}
          />
          <div>
            <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">קבוצה</label>
            {showCustomInput ? (
              <div className="flex gap-2">
                <Input
                  id="guest-custom-subgroup"
                  value={customSubgroup}
                  onChange={(e) => setCustomSubgroup(e.target.value)}
                  placeholder="שם הקבוצה החדשה..."
                />
                <button
                  type="button"
                  onClick={() => { setShowCustomInput(false); setCustomSubgroup(''); setForm({ ...form, subgroup: 'family' }) }}
                  className="shrink-0 p-2 text-warm-400 hover:text-warm-600 dark:hover:text-warm-300 transition"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Listbox value={form.subgroup} onChange={handleSubgroupChange}>
                <div className="relative">
                  <ListboxButton className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 transition text-sm cursor-pointer">
                    <span>{getSubgroupLabel(form.subgroup)}</span>
                    <ChevronUpDownIcon className="w-4 h-4 text-warm-400" />
                  </ListboxButton>
                  <ListboxOptions className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-800 shadow-lg py-1 text-sm focus:outline-none">
                    {subgroupOptions.map((opt) => {
                      const isCustom = opt.value !== ADD_NEW_SENTINEL && !(DEFAULT_SUBGROUPS as readonly string[]).includes(opt.value)
                      return (
                        <ListboxOption
                          key={opt.value}
                          value={opt.value}
                          className="group flex items-center justify-between px-3 py-2 cursor-pointer data-[focus]:bg-warm-50 dark:data-[focus]:bg-warm-700 data-[selected]:font-medium text-warm-700 dark:text-warm-300"
                        >
                          <span>{opt.label}</span>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                onDeleteSubgroup(opt.value)
                              }}
                              className="p-0.5 text-warm-300 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </ListboxOption>
                      )
                    })}
                  </ListboxOptions>
                </div>
              </Listbox>
            )}
          </div>
        </div>

        <Select
          id="guest-likelihood"
          label="סבירות הגעה"
          options={likelihoodOptions}
          value={form.likelihood}
          onChange={(e) => setForm({ ...form, likelihood: e.target.value as Likelihood })}
        />

        {/* Plus-one section */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.has_plus_one}
              onChange={(e) => setForm({ ...form, has_plus_one: e.target.checked })}
              className="w-4 h-4 rounded border-warm-300 dark:border-warm-600 text-rose-500 focus:ring-rose-300 dark:focus:ring-rose-500 dark:bg-warm-700"
            />
            <span className="text-sm text-warm-700 dark:text-warm-300">מגיע/ה עם פלוס אחד</span>
          </label>
        </div>

        {form.has_plus_one && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="guest-plus-one"
              label="שם הפלוס אחד"
              value={form.plus_one_name}
              onChange={(e) => setForm({ ...form, plus_one_name: e.target.value })}
            />
            <Select
              id="guest-plus-one-likelihood"
              label="סבירות הגעה (פלוס)"
              options={likelihoodOptions}
              value={form.plus_one_likelihood}
              onChange={(e) => setForm({ ...form, plus_one_likelihood: e.target.value as Likelihood })}
            />
          </div>
        )}

        {/* Children section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-warm-700 dark:text-warm-300">ילדים</span>
            <button
              type="button"
              onClick={addChild}
              className="inline-flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              הוספת ילד/ה
            </button>
          </div>
          {form.children.length > 0 && (
            <div className="space-y-2">
              {form.children.map((child, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-warm-50 dark:bg-warm-700/30">
                  <div className="flex-1 space-y-2">
                    <Input
                      id={`child-name-${i}`}
                      value={child.name}
                      onChange={(e) => updateChild(i, { name: e.target.value })}
                      placeholder="שם הילד/ה"
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={child.under_10}
                          onChange={(e) => updateChild(i, { under_10: e.target.checked })}
                          className="w-4 h-4 rounded border-warm-300 dark:border-warm-600 text-rose-500 focus:ring-rose-300 dark:focus:ring-rose-500 dark:bg-warm-700"
                        />
                        <span className="text-xs text-warm-600 dark:text-warm-400">מתחת ל-10</span>
                      </label>
                      <Select
                        id={`child-likelihood-${i}`}
                        options={likelihoodOptions}
                        value={child.likelihood}
                        onChange={(e) => updateChild(i, { likelihood: e.target.value as Likelihood })}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChild(i)}
                    className="p-1 text-warm-400 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer mt-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          id="guest-phone"
          label="טלפון"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          type="tel"
          dir="ltr"
        />

        <div>
          <label htmlFor="guest-notes" className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
            הערות
          </label>
          <textarea
            id="guest-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
        )}

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
