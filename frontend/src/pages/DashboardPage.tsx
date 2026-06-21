import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Badge } from '@/components/ui/Card'
import { staggerContainer, fadeInUp } from '@/animations/variants'
import { useAuth } from '@/context/AuthContext'
import { publicService } from '@/services/publicService'
import { Calendar, Clock, Video, AlertCircle } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      publicService.getUserAppointments(user.id)
        .then((data) => {
          setAppointments(data)
          setError(null)
        })
        .catch((err) => {
          console.error("Error loading appointments:", err)
          setError("Failed to load appointments. Please try again later.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user])

  const stats = [
    { label: 'Total Posts', value: 1243, change: '+12%' },
    { label: 'Community Members', value: 5847, change: '+8%' },
    { label: 'Resources Shared', value: 342, change: '+23%' },
    { label: 'Support Interactions', value: 12456, change: '+31%' },
  ]

  const chartData = [
    { name: 'Mon', posts: 40, support: 24 },
    { name: 'Tue', posts: 30, support: 13 },
    { name: 'Wed', posts: 20, support: 98 },
    { name: 'Thu', posts: 27, support: 39 },
    { name: 'Fri', posts: 20, support: 48 },
    { name: 'Sat', posts: 36, support: 58 },
    { name: 'Sun', posts: 45, support: 67 },
  ]

  const categoryStats = [
    { name: 'Stress', value: 340 },
    { name: 'Anxiety', value: 280 },
    { name: 'Depression', value: 200 },
    { name: 'Academic', value: 150 },
    { name: 'Self-Care', value: 273 },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Track community wellbeing and insights</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card variant="glass">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-green-500 text-sm font-medium mb-1">{stat.change}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* My Appointments */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-lavender-500/10 text-lavender-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">My Scheduled Sessions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Track and manage your upcoming and past counseling sessions</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-500"></div>
              <p className="text-sm text-slate-500">Retrieving your appointments...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-slate-500/5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">No sessions booked yet</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Need professional guidance? Book a private, confidential session with our certified counselors.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {appointments.map((appointment) => {
                let badgeVariant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
                const statusLower = appointment.status?.toLowerCase() || ''
                if (statusLower.includes('approve') || statusLower.includes('pending')) {
                  badgeVariant = 'warning'
                } else if (statusLower.includes('upcoming') || statusLower.includes('scheduled')) {
                  badgeVariant = 'info'
                } else if (statusLower.includes('completed')) {
                  badgeVariant = 'success'
                } else if (statusLower.includes('decline') || statusLower.includes('cancel')) {
                  badgeVariant = 'error'
                }

                return (
                  <motion.div
                    key={appointment.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-lavender-500" />
                          {appointment.type || 'Video Session'}
                        </span>
                        <Badge variant={badgeVariant} size="sm">
                          {appointment.status}
                        </Badge>
                      </div>

                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">
                        {appointment.counselor_name}
                      </h4>

                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-lavender-500" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-soft-teal-500" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <p className="text-xs italic text-slate-500 dark:text-slate-400 line-clamp-2">
                          Note: {appointment.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {/* Activity Chart */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card variant="glass">
            <h3 className="text-lg font-bold mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(100, 100, 100, 0.5)" />
                <YAxis stroke="rgba(100, 100, 100, 0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(139, 82, 255, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="posts" stroke="#8b52ff" strokeWidth={2} />
                <Line type="monotone" dataKey="support" stroke="#14b8a6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card variant="glass">
            <h3 className="text-lg font-bold mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(100, 100, 100, 0.5)" />
                <YAxis stroke="rgba(100, 100, 100, 0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(139, 82, 255, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#8b52ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Trending Topics */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Card variant="glass">
          <h3 className="text-lg font-bold mb-6">Trending Discussion Topics</h3>
          <div className="space-y-4">
            {['Mindfulness & Meditation', 'Sleep Better', 'Work-Life Balance', 'Building Resilience'].map(
              (topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-lavender-500/10 to-soft-teal-500/10 rounded-lg"
                >
                  <p className="font-medium">{topic}</p>
                  <p className="text-sm text-slate-500">+42% interest</p>
                </motion.div>
              )
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default DashboardPage
