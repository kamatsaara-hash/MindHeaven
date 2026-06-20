import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export const AdminPageHeader = ({ title, description, action }: AdminPageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
