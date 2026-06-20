import { Search, Bell, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const notifications = [
  {
    id: 1,
    title: 'High Risk Alert: User reported',
    time: '2 mins ago',
    route: '/admin/crisis',
    unread: true,
  },
  {
    id: 2,
    title: 'New Counselor Application',
    time: '1 hour ago',
    route: '/admin/counselors',
    unread: true,
  },
]

export const AdminTopNav = () => {
  const { isDark, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [readIds, setReadIds] = useState<number[]>([])
  const navigate = useNavigate()

  const handleNotificationClick = (route: string, id: number) => {
    setReadIds((prev) => [...prev, id])
    setShowNotifications(false)
    navigate(route)
  }

  const handleMarkAllRead = () => {
    setReadIds(notifications.map((n) => n.id))
    setShowNotifications(false)
    toast.success('All notifications marked as read')
  }

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div className="h-full flex items-center justify-between px-6">
        
        {/* Mobile Menu Button - Hidden on desktop */}
        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden sm:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users, counselors, appointments..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 transition-shadow"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-lavender-600 dark:text-lavender-400 font-medium hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                    {notifications.map((notif) => {
                      const isUnread = !readIds.includes(notif.id)
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.route, notif.id)}
                          className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-start gap-3"
                        >
                          {isUnread && (
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-lavender-500 flex-shrink-0" />
                          )}
                          <div className={isUnread ? '' : 'ml-5'}>
                            <p className={`text-sm font-medium ${isUnread ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={() => { setShowNotifications(false); navigate('/admin/notifications') }}
                      className="text-xs text-lavender-600 dark:text-lavender-400 font-medium hover:underline"
                    >
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              AD
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">System Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">admin@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
