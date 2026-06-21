import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Heart, BookOpen, Calendar, Clock } from 'lucide-react'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { publicService } from '@/services/publicService'
import { fadeInUp, staggerContainer } from '@/animations/variants'

const ProfilePage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [savedResources] = useState([
    { id: '1', title: 'Mindfulness Guide' },
    { id: '2', title: 'Stress Management Tips' },
  ])

  const [contributions] = useState([
    { id: '1', type: 'post', content: 'Shared a helpful meditation technique', date: '2 days ago' },
    { id: '2', type: 'comment', content: 'Commented on anxiety management post', date: '5 days ago' },
  ])

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      publicService.getUserAppointments(user.id)
        .then((data) => {
          setAppointments(data)
          setError(null)
        })
        .catch((err) => {
          console.error("Error loading appointments in ProfilePage:", err)
          setError("Failed to load appointments.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Manage your profile and activity</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card variant="glass" className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender-500 to-soft-teal-500 mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{user?.nickname}</h2>
            <Badge variant="info" className="mb-4">
              {user?.isAnonymous ? 'Anonymous' : 'Verified'}
            </Badge>
            {user?.email && <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{user.email}</p>}
            <Button variant="primary" size="sm" className="w-full">
              Edit Profile
            </Button>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-8"
        >
          {/* Saved Resources */}
          <motion.div variants={fadeInUp}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-lavender-500" />
                <h3 className="text-lg font-bold">Saved Resources</h3>
              </div>
              <div className="space-y-3">
                {savedResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-sm">{resource.title}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* My Appointments */}
          <motion.div variants={fadeInUp}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-lavender-500" />
                <h3 className="text-lg font-bold">My Appointments</h3>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lavender-500"></div>
                  <p className="text-xs text-slate-500">Loading appointments...</p>
                </div>
              ) : error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : appointments.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-500/5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
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
                      <div
                        key={appointment.id}
                        className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20 text-sm flex flex-col justify-between hover:bg-white/40 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {appointment.counselor_name}
                          </span>
                          <Badge variant={badgeVariant} size="sm">
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-lavender-500" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-soft-teal-500" />
                            {appointment.time}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="text-xs italic text-slate-500 mt-2 border-t border-slate-100 dark:border-slate-800/50 pt-1.5 line-clamp-1">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Recent Contributions */}
          <motion.div variants={fadeInUp}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-baby-pink-500" />
                <h3 className="text-lg font-bold">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {contributions.map((contribution) => (
                  <motion.div
                    key={contribution.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="info" size="sm" className="mb-2">
                          {contribution.type}
                        </Badge>
                        <p className="font-medium text-sm">{contribution.content}</p>
                      </div>
                      <p className="text-xs text-slate-500">{contribution.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
