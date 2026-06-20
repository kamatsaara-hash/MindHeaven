import { useEffect, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { Users, UserCheck, Calendar, ShieldAlert, Activity, HeartPulse, Zap, AlertTriangle } from 'lucide-react'
import { adminService } from '@/services/adminService'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
const RISK_COLORS = ['#ef4444', '#f59e0b', '#10b981']

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const riskData = [
    { name: 'High Risk', value: stats?.highRiskAlerts || 0 },
    { name: 'Medium Risk', value: stats?.mediumRiskAlerts || 0 },
    { name: 'Low Risk', value: stats?.riskDistribution?.low || 0 }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Dashboard Overview" 
        description="Real-time platform analytics and metrics"
      />

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <AdminStatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          delay={0.1}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <AdminStatCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString()}
          icon={<Activity className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          delay={0.2}
          colorClass="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
        />
        <AdminStatCard
          title="Verified Counselors"
          value={stats?.counselorsAvailable}
          icon={<UserCheck className="w-6 h-6" />}
          trend={{ value: 2, isPositive: true }}
          delay={0.3}
          colorClass="bg-lavender-100 text-lavender-600 dark:bg-lavender-500/20 dark:text-lavender-400"
        />
        <AdminStatCard
          title="Appointments Today"
          value={stats?.appointmentsToday}
          icon={<Calendar className="w-6 h-6" />}
          trend={{ value: stats?.appointmentsToday > 0 ? 5 : 0, isPositive: stats?.appointmentsToday > 0 }}
          delay={0.4}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
        />
        <AdminStatCard
          title="Reported Posts"
          value={stats?.reportedPosts}
          icon={<ShieldAlert className="w-6 h-6" />}
          trend={{ value: stats?.reportedPosts, isPositive: false }}
          delay={0.5}
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
        />
        <AdminStatCard
          title="High Risk Users"
          value={stats?.highRiskAlerts}
          icon={<AlertTriangle className="w-6 h-6" />}
          trend={{ value: 0, isPositive: true }}
          delay={0.6}
          colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Posts</p>
                <p className="text-2xl font-bold mt-1">{stats?.totalPosts}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Comments</p>
                <p className="text-2xl font-bold mt-1">{stats?.totalComments}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Appointments</p>
                <p className="text-2xl font-bold mt-1">{stats?.appointmentsTotal}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Counselors</p>
                <p className="text-2xl font-bold mt-1">{stats?.totalCounselors}</p>
              </div>
              <UserCheck className="w-8 h-8 text-lavender-500 opacity-50" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Platform Growth (Total Users)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Cumulative user registration over the last 12 months</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [value, 'Users']}
                  />
                  <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Risk Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <Card className="p-6 h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">User Risk Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Classification of users by risk level</p>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [value, 'Users']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Topic Engagement Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Topic Engagement</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Top discussion topics by engagement</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topicEngagement} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [value, 'Engagement']}
                />
                <Bar dataKey="value" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
