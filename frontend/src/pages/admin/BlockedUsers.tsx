import { useEffect, useState, useMemo } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { adminService } from '@/services/adminService'
import { ShieldBan, ShieldCheck, Trash2, Search, AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchBlockedUsers = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getBlockedUsers()
      setBlockedUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch blocked users:', error)
      toast.error('Failed to load blocked users')
      setBlockedUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return blockedUsers.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }, [blockedUsers, search])

  const handleUnblock = async (userId: string, userName: string) => {
    try {
      setActionLoading(userId)
      await adminService.unblockUser(userId)
      toast.success(`${userName} unblocked — report count reset to zero.`)
      fetchBlockedUsers()
    } catch {
      toast.error('Failed to unblock user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Permanently delete this user? This cannot be undone.')) return
    try {
      setActionLoading(userId)
      await adminService.deleteUser(userId)
      toast.success('User deleted successfully')
      fetchBlockedUsers()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      cell: (item: any) => (
        <div>
          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{item.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{item.email}</p>
        </div>
      )
    },
    {
      header: 'Reports',
      accessor: 'reportCount',
      cell: (item: any) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
          <AlertTriangle className="w-3 h-3" />
          {item.reportCount} reports
        </span>
      )
    },
    {
      header: 'Risk Level',
      accessor: 'riskLevel',
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.riskLevel === 'High'
            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
            : item.riskLevel === 'Medium'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
            : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
        }`}>
          {item.riskLevel || 'Unknown'}
        </span>
      )
    },
    { header: 'Joined', accessor: 'joinedAt' }
  ]

  const actions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleUnblock(item.id, item.name)}
        disabled={actionLoading === item.id}
        title="Unblock & Reset Reports"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 transition-all disabled:opacity-50"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Unblock
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        disabled={actionLoading === item.id}
        title="Delete User"
        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Blocked Users"
        description="Users blocked manually or automatically after 5+ reports. Unblocking resets their report count to zero."
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <ShieldBan className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{blockedUsers.length}</p>
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">Total Blocked</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {blockedUsers.reduce((sum, u) => sum + (u.reportCount || 0), 0)}
            </p>
            <p className="text-xs text-amber-500 dark:text-amber-400 font-medium">Total Reports</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {blockedUsers.filter(u => u.reportCount > 5).length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Auto-blocked (5+ reports)</p>
          </div>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 w-full"
          />
        </div>
        <button
          onClick={fetchBlockedUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {search ? 'No matching blocked users' : 'No blocked users'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {search ? 'Try a different search term.' : 'All users are currently in good standing.'}
          </p>
        </motion.div>
      ) : (
        <AdminTable columns={columns} data={filteredUsers} actions={actions} />
      )}
    </div>
  )
}
