'use client'

import { useAppSettings } from './useAppSettings'

export function useBlockedDates() {
  return useAppSettings<string[]>('blocked_dates', [])
}
