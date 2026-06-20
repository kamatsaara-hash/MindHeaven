import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AdminStatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
  delay?: number
}

export const AdminStatCard = ({
  title,
  value,
  icon,
  trend,
  colorClass = 'bg-lavender-50 text-lavender-600 dark:bg-lavender-500/10 dark:text-lavender-400',
  delay = 0
}: AdminStatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className={trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-slate-500 dark:text-slate-500">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
