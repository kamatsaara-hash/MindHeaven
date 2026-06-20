import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import { useAuth } from '@/context/AuthContext'
import { AlertTriangle, X } from 'lucide-react'

const MainLayout = () => {
  const { user } = useAuth()
  const [dismissedWarnings, setDismissedWarnings] = useState(false)

  const hasWarnings = user?.warnings && user.warnings.length > 0
  const latestWarning = hasWarnings ? user!.warnings![user!.warnings!.length - 1] : null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      {/* Warning Notification Banner */}
      <AnimatePresence>
        {hasWarnings && !dismissedWarnings && (
          <motion.div
            key="warning-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[68px] left-0 right-0 z-40"
          >
            <div className="bg-amber-500/95 backdrop-blur-md border-b border-amber-600/40 shadow-lg px-4 py-3">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">
                      ⚠️ Your account has received a warning from admin
                    </p>
                    <p className="text-amber-800 text-xs mt-0.5">
                      Reason: <span className="font-medium">{latestWarning?.reason || 'Community guideline violation'}</span>
                      {user!.warnings!.length > 1 && (
                        <span className="ml-2 text-amber-700">
                          (and {user!.warnings!.length - 1} more warning{user!.warnings!.length > 2 ? 's' : ''})
                        </span>
                      )}
                      . Continued violations may result in your account being blocked.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDismissedWarnings(true)}
                  className="shrink-0 p-1.5 rounded-lg text-amber-800 hover:bg-amber-600/30 transition-colors"
                  aria-label="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className={`pt-20 pb-20 ${hasWarnings && !dismissedWarnings ? 'mt-[52px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
