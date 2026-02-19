interface SummaryCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'rose' | 'gold' | 'emerald' | 'blue'
}

const colorMap = {
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  gold: 'bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
}

export default function SummaryCard({ title, value, subtitle, icon, color = 'rose' }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-warm-500 dark:text-warm-400">{title}</p>
        <p className="text-2xl font-bold text-warm-900 dark:text-warm-100 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-warm-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
