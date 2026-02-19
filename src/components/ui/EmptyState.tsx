interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="flex justify-center mb-3 text-warm-300 dark:text-warm-500">{icon}</div>}
      <h3 className="text-warm-700 dark:text-warm-200 font-medium">{title}</h3>
      {description && <p className="text-warm-500 dark:text-warm-400 text-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
