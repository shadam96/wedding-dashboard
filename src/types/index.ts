export type GuestSide = 'suson' | 'susonit'
export type DefaultGuestSubgroup = 'family' | 'friends' | 'work' | 'army' | 'school' | 'other'
export type GuestSubgroup = DefaultGuestSubgroup | (string & {})
export type Likelihood = 'red' | 'yellow' | 'green'

export const DEFAULT_SUBGROUPS: DefaultGuestSubgroup[] = ['family', 'friends', 'work', 'army', 'school', 'other']

export interface GuestChild {
  name: string
  under_10: boolean
  likelihood: Likelihood
}

export interface Guest {
  id: string
  name: string
  side: GuestSide
  subgroup: GuestSubgroup
  likelihood: Likelihood
  has_plus_one: boolean
  plus_one_name: string | null
  plus_one_likelihood: Likelihood | null
  children: GuestChild[]
  phone: string | null
  notes: string | null
  created_at: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskOwner = 'suson' | 'susonit' | 'both'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  owner: TaskOwner
  due_date: string | null
  created_at: string
}

export interface BudgetItem {
  id: string
  category: string
  description: string
  total_amount: number
  paid_amount: number
  notes: string | null
  created_at: string
}

// Hebrew label maps
import { COUPLE_NAMES } from '@/lib/couple-names'

export const SIDE_LABELS: Record<GuestSide, string> = {
  suson: COUPLE_NAMES.suson,
  susonit: COUPLE_NAMES.susonit,
}

export const SUBGROUP_LABELS: Record<string, string> = {
  family: 'משפחה',
  friends: 'חברים',
  work: 'עבודה',
  army: 'צבא',
  school: 'לימודים',
  other: 'אחר',
}

export function getSubgroupLabel(subgroup: string): string {
  return SUBGROUP_LABELS[subgroup] || subgroup
}

export const LIKELIHOOD_LABELS: Record<Likelihood, string> = {
  green: 'בטוח',
  yellow: 'אולי',
  red: 'לא סביר',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'לביצוע',
  in_progress: 'בתהליך',
  done: 'הושלם',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
}

export const OWNER_LABELS: Record<TaskOwner, string> = {
  suson: COUPLE_NAMES.suson,
  susonit: COUPLE_NAMES.susonit,
  both: 'שניהם',
}

export type VenueStatus = 'considering' | 'visited' | 'booked' | 'rejected'

export interface Venue {
  id: string
  name: string
  location: string | null
  min_price: number
  max_price: number
  capacity: number | null
  contact_name: string | null
  contact_phone: string | null
  status: VenueStatus
  available_dates: string[]
  notes: string | null
  created_at: string
}

export const VENUE_STATUS_LABELS: Record<VenueStatus, string> = {
  considering: 'בבדיקה',
  visited: 'ביקרנו',
  booked: 'הוזמן',
  rejected: 'נפסל',
}

export const VENUE_COLORS = [
  { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500', border: 'border-rose-300', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-300', darkBorder: 'dark:border-rose-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500', border: 'border-sky-300', darkBg: 'dark:bg-sky-900/30', darkText: 'dark:text-sky-300', darkBorder: 'dark:border-sky-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-300', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-300', darkBorder: 'dark:border-amber-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-300', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-300', darkBorder: 'dark:border-emerald-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500', border: 'border-violet-300', darkBg: 'dark:bg-violet-900/30', darkText: 'dark:text-violet-300', darkBorder: 'dark:border-violet-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-300', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-300', darkBorder: 'dark:border-orange-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500', border: 'border-cyan-300', darkBg: 'dark:bg-cyan-900/30', darkText: 'dark:text-cyan-300', darkBorder: 'dark:border-cyan-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500', border: 'border-pink-300', darkBg: 'dark:bg-pink-900/30', darkText: 'dark:text-pink-300', darkBorder: 'dark:border-pink-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500', border: 'border-teal-300', darkBg: 'dark:bg-teal-900/30', darkText: 'dark:text-teal-300', darkBorder: 'dark:border-teal-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', border: 'border-indigo-300', darkBg: 'dark:bg-indigo-900/30', darkText: 'dark:text-indigo-300', darkBorder: 'dark:border-indigo-700' },
] as const

export function getVenueColor(index: number) {
  return VENUE_COLORS[index % VENUE_COLORS.length]
}

export const BUDGET_CATEGORIES = [
  'אולם',
  'קייטרינג',
  'צילום ווידאו',
  'מוזיקה/DJ',
  'פרחים ועיצוב',
  'שמלה וחליפה',
  'הזמנות ומיתוג',
  'רבנות ואישורים',
  'תחבורה',
  'אחר',
] as const
