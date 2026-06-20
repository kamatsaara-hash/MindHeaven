import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Heart, BookOpen } from 'lucide-react'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { fadeInUp, staggerContainer } from '@/animations/variants'

const ProfilePage = () => {
  const { user } = useAuth()
  const [savedResources] = useState([
    { id: '1', title: 'Mindfulness Guide' },
    { id: '2', title: 'Stress Management Tips' },
  ])

  const [contributions] = useState([
    { id: '1', type: 'post', content: 'Shared a helpful meditation technique', date: '2 days ago' },
    { id: '2', type: 'comment', content: 'Commented on anxiety management post', date: '5 days ago' },
  ])

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
