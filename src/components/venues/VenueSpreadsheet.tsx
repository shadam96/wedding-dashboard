'use client'

import { useState, useRef, useCallback } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useVenueSpreadsheet } from '@/hooks/useVenueSpreadsheet'

export default function VenueSpreadsheet() {
  const {
    data,
    loading,
    updateCell,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    isProtectedColumn,
  } = useVenueSpreadsheet()

  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColName, setNewColName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const newColRef = useRef<HTMLInputElement>(null)

  const startEdit = useCallback((rowId: string, colId: string, currentValue: string) => {
    setEditingCell({ rowId, colId })
    setEditValue(currentValue)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const commitEdit = useCallback(() => {
    if (editingCell) {
      updateCell(editingCell.rowId, editingCell.colId, editValue)
      setEditingCell(null)
    }
  }, [editingCell, editValue, updateCell])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!editingCell) return

      if (e.key === 'Enter' || e.key === 'Escape') {
        if (e.key === 'Enter') commitEdit()
        else setEditingCell(null)
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        commitEdit()

        const colIdx = data.columns.findIndex((c) => c.id === editingCell.colId)
        const rowIdx = data.rows.findIndex((r) => r.id === editingCell.rowId)
        let nextCol = colIdx + (e.shiftKey ? -1 : 1)
        let nextRow = rowIdx

        if (nextCol >= data.columns.length) {
          nextCol = 0
          nextRow = rowIdx + 1
        } else if (nextCol < 0) {
          nextCol = data.columns.length - 1
          nextRow = rowIdx - 1
        }

        if (nextRow >= 0 && nextRow < data.rows.length) {
          const nr = data.rows[nextRow]
          const nc = data.columns[nextCol]
          startEdit(nr.id, nc.id, nr.cells[nc.id] || '')
        }
      }
    },
    [editingCell, commitEdit, data, startEdit]
  )

  function handleAddColumn() {
    if (newColName.trim()) {
      addColumn(newColName.trim())
      setNewColName('')
      setAddingColumn(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-sm border border-warm-100 dark:border-warm-700 p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-3 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-sm border border-warm-100 dark:border-warm-700 p-4 sm:p-6 mb-6">
      <h3 className="text-lg font-bold text-warm-900 dark:text-warm-50 mb-4">השוואת מחירים</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {data.columns.map((col) => (
                <th
                  key={col.id}
                  className="group px-3 py-2 text-start text-xs font-semibold text-warm-600 dark:text-warm-300 bg-warm-50 dark:bg-warm-700/50 border border-warm-200 dark:border-warm-600 first:rounded-tr-lg whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.name}</span>
                    {!isProtectedColumn(col.id) && (
                      <button
                        onClick={() => removeColumn(col.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-warm-400 hover:text-red-500 transition"
                        title="מחיקת עמודה"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-2 py-2 bg-warm-50 dark:bg-warm-700/50 border border-warm-200 dark:border-warm-600 last:rounded-tl-lg w-16">
                {addingColumn ? (
                  <div className="flex items-center gap-1">
                    <input
                      ref={newColRef}
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddColumn()
                        if (e.key === 'Escape') { setAddingColumn(false); setNewColName('') }
                      }}
                      onBlur={() => { if (newColName.trim()) handleAddColumn(); else setAddingColumn(false) }}
                      className="w-20 px-1 py-0.5 text-xs border border-warm-300 dark:border-warm-500 rounded bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100"
                      autoFocus
                      placeholder="שם עמודה"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingColumn(true); setTimeout(() => newColRef.current?.focus(), 0) }}
                    className="p-1 text-warm-400 hover:text-rose-500 transition"
                    title="הוספת עמודה"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id} className="group/row hover:bg-warm-50/50 dark:hover:bg-warm-700/20">
                {data.columns.map((col) => {
                  const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id
                  const cellValue = row.cells[col.id] || ''

                  return (
                    <td
                      key={col.id}
                      className="border border-warm-200 dark:border-warm-600 px-1 py-0.5"
                      onClick={() => !isEditing && startEdit(row.id, col.id, cellValue)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 text-sm bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 border-0 outline-none ring-2 ring-rose-300 dark:ring-rose-500 rounded"
                        />
                      ) : (
                        <div className="px-2 py-1 min-h-[30px] text-warm-800 dark:text-warm-200 cursor-text">
                          {cellValue || <span className="text-warm-300 dark:text-warm-600">&nbsp;</span>}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="border border-warm-200 dark:border-warm-600 px-2 py-1 text-center">
                  {data.rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="opacity-0 group-hover/row:opacity-100 p-1 text-warm-400 hover:text-red-500 transition"
                      title="מחיקת שורה"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-1.5 text-sm text-warm-500 hover:text-rose-500 dark:text-warm-400 dark:hover:text-rose-400 transition"
      >
        <PlusIcon className="w-4 h-4" />
        הוספת שורה
      </button>
    </div>
  )
}
