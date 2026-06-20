import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { staggerContainer, fadeInUp } from '@/animations/variants'

const DashboardPage = () => {
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
