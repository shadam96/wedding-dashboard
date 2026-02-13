import type { Likelihood } from '@/types'

const colors: Record<Likelihood, string> = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-red-400',
}

export default function StatusDot({ likelihood }: { likelihood: Likelihood }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${colors[likelihood]}`}
      title={likelihood}
    />
  )
}
