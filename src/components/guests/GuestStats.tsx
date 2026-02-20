import type { Guest } from '@/types'

interface GuestStatsProps {
  guests: Guest[]
}

export default function GuestStats({ guests }: GuestStatsProps) {
  const total = guests.length
  const plusOnes = guests.filter((g) => g.has_plus_one).length
  const allChildren = guests.flatMap((g) => g.children || [])
  const childrenCount = allChildren.length
  const totalHeadcount = total + plusOnes + childrenCount
  const suson = guests.filter((g) => g.side === 'suson').length
  const susonit = guests.filter((g) => g.side === 'susonit').length

  // Count likelihoods across all people
  let green = 0, yellow = 0, red = 0
  for (const g of guests) {
    if (g.likelihood === 'green') green++
    else if (g.likelihood === 'yellow') yellow++
    else red++

    if (g.has_plus_one) {
      const pl = g.plus_one_likelihood || g.likelihood
      if (pl === 'green') green++
      else if (pl === 'yellow') yellow++
      else red++
    }

    for (const c of g.children || []) {
      if (c.likelihood === 'green') green++
      else if (c.likelihood === 'yellow') yellow++
      else red++
    }
  }

  const under10 = allChildren.filter((c) => c.under_10).length

  const subParts = [`${total} מוזמנים + ${plusOnes} פלוסים`]
  if (childrenCount > 0) subParts[0] += ` + ${childrenCount} ילדים`

  const stats = [
    { label: 'סה"כ אנשים', value: totalHeadcount, sub: subParts[0] },
    { label: 'סוסון', value: suson },
    { label: 'סוסונית', value: susonit },
    { label: 'בטוח', value: green, dotColor: 'bg-emerald-400' },
    { label: 'אולי', value: yellow, dotColor: 'bg-amber-400' },
    { label: 'לא סביר', value: red, dotColor: 'bg-red-400' },
  ]

  if (under10 > 0) {
    stats.push({ label: 'ילדים מתחת ל-10', value: under10, dotColor: undefined, sub: undefined })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-3 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {stat.dotColor && (
              <span className={`w-2 h-2 rounded-full ${stat.dotColor}`} />
            )}
            <span className="text-xs text-warm-500 dark:text-warm-400">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-warm-900 dark:text-warm-100">{stat.value}</p>
          {stat.sub && <p className="text-xs text-warm-400">{stat.sub}</p>}
        </div>
      ))}
    </div>
  )
}
