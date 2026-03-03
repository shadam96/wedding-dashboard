'use client'

import { useCallback, useRef } from 'react'
import { useAppSettings } from './useAppSettings'
import type { SpreadsheetData, SpreadsheetColumn, SpreadsheetRow } from '@/types'

const DEFAULT_COLUMNS: SpreadsheetColumn[] = [
  { id: 'venue', name: 'מקום' },
  { id: 'price_per_plate', name: 'מחיר לצלחת' },
  { id: 'guest_count', name: 'מספר מוזמנים' },
  { id: 'estimated_total', name: 'סה"כ משוער' },
  { id: 'notes', name: 'הערות' },
]

const DEFAULT_DATA: SpreadsheetData = {
  columns: DEFAULT_COLUMNS,
  rows: [{ id: '1', cells: {} }],
}

// IDs that cannot be deleted
const PROTECTED_COLUMN_IDS = new Set(DEFAULT_COLUMNS.map((c) => c.id))

export function useVenueSpreadsheet() {
  const { value: data, save, loading } = useAppSettings<SpreadsheetData>('venue_spreadsheet', DEFAULT_DATA)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = useCallback(
    (newData: SpreadsheetData) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => save(newData), 300)
    },
    [save]
  )

  const updateCell = useCallback(
    (rowId: string, colId: string, value: string) => {
      const newData = {
        ...data,
        rows: data.rows.map((r) =>
          r.id === rowId ? { ...r, cells: { ...r.cells, [colId]: value } } : r
        ),
      }
      debouncedSave(newData)
      return newData
    },
    [data, debouncedSave]
  )

  const addRow = useCallback(() => {
    const newRow: SpreadsheetRow = { id: String(Date.now()), cells: {} }
    const newData = { ...data, rows: [...data.rows, newRow] }
    save(newData)
    return newData
  }, [data, save])

  const removeRow = useCallback(
    (rowId: string) => {
      const newData = { ...data, rows: data.rows.filter((r) => r.id !== rowId) }
      save(newData)
      return newData
    },
    [data, save]
  )

  const addColumn = useCallback(
    (name: string) => {
      const col: SpreadsheetColumn = { id: `custom_${Date.now()}`, name }
      const newData = { ...data, columns: [...data.columns, col] }
      save(newData)
      return newData
    },
    [data, save]
  )

  const removeColumn = useCallback(
    (colId: string) => {
      if (PROTECTED_COLUMN_IDS.has(colId)) return data
      const newData = {
        columns: data.columns.filter((c) => c.id !== colId),
        rows: data.rows.map((r) => {
          const { [colId]: _, ...rest } = r.cells
          return { ...r, cells: rest }
        }),
      }
      save(newData)
      return newData
    },
    [data, save]
  )

  const renameColumn = useCallback(
    (colId: string, name: string) => {
      const newData = {
        ...data,
        columns: data.columns.map((c) => (c.id === colId ? { ...c, name } : c)),
      }
      save(newData)
      return newData
    },
    [data, save]
  )

  return {
    data,
    loading,
    updateCell,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    renameColumn,
    isProtectedColumn: (id: string) => PROTECTED_COLUMN_IDS.has(id),
  }
}
