import type { Guest } from '@/types'

interface GuestStatsProps {
  guests: Guest[]
}

export default function GuestStats({ guests }: GuestStatsProps) {
  const total = guests.length
  const plusOnes = guests.filter((g) => g.has_plus_one).length
  const totalWithPlusOnes = total + plusOnes
  const suson = guests.filter((g) => g.side === 'suson').length
  const susonit = guests.filter((g) => g.side === 'susonit').length
  const green = guests.filter((g) => g.likelihood === 'green').length
  const yellow = guests.filter((g) => g.likelihood === 'yellow').length
  const red = guests.filter((g) => g.likelihood === 'red').length

  const stats = [
    { label: 'סה"כ מוזמנים', value: totalWithPlusOnes, sub: `${total} + ${plusOnes} פלוסים` },
    { label: 'סוסון', value: suson },
    { label: 'סוסונית', value: susonit },
    { label: 'בטוח', value: green, dotColor: 'bg-emerald-400' },
    { label: 'אולי', value: yellow, dotColor: 'bg-amber-400' },
    { label: 'לא סביר', value: red, dotColor: 'bg-red-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-warm-100 p-3 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {stat.dotColor && (
              <span className={`w-2 h-2 rounded-full ${stat.dotColor}`} />
            )}
            <span className="text-xs text-warm-500">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-warm-900">{stat.value}</p>
          {stat.sub && <p className="text-xs text-warm-400">{stat.sub}</p>}
        </div>
      ))}
    </div>
  )
}
