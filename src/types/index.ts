export type GuestSide = 'suson' | 'susonit'
export type GuestSubgroup = 'family' | 'friends' | 'work' | 'army' | 'school' | 'other'
export type Likelihood = 'red' | 'yellow' | 'green'

export interface Guest {
  id: string
  name: string
  side: GuestSide
  subgroup: GuestSubgroup
  likelihood: Likelihood
  has_plus_one: boolean
  plus_one_name: string | null
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
export const SIDE_LABELS: Record<GuestSide, string> = {
  suson: 'סוסון',
  susonit: 'סוסונית',
}

export const SUBGROUP_LABELS: Record<GuestSubgroup, string> = {
  family: 'משפחה',
  friends: 'חברים',
  work: 'עבודה',
  army: 'צבא',
  school: 'לימודים',
  other: 'אחר',
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
  suson: 'סוסון',
  susonit: 'סוסונית',
  both: 'שניהם',
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
