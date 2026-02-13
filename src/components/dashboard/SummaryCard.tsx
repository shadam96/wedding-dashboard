interface SummaryCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'rose' | 'gold' | 'emerald' | 'blue'
}

const colorMap = {
  rose: 'bg-rose-100 text-rose-600',
  gold: 'bg-gold-100 text-gold-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
}

export default function SummaryCard({ title, value, subtitle, icon, color = 'rose' }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-warm-100 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-warm-500">{title}</p>
        <p className="text-2xl font-bold text-warm-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-warm-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
