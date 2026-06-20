import { useEffect, useState, useMemo } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/Button'
import { Search, ShieldBan, Trash2, ShieldCheck, X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'counselors' | 'blocked'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [counselors, setCounselors] = useState<any[]>([])
  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Search and Filter States
  const [userSearch, setUserSearch] = useState('')
  const [userRiskFilter, setUserRiskFilter] = useState<string>('All')
  const [counselorSearch, setCounselorSearch] = useState('')
  const [counselorStatusFilter, setCounselorStatusFilter] = useState<string>('All')
  const [blockedSearch, setBlockedSearch] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    riskLevel: 'Low',
    password: 'password123'
  })

  // Fetch users + counselors (primary data)
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [usersData, counselorsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getCounselors()
      ])
      setUsers(usersData)
      setCounselors(counselorsData)
    } catch (error) {
      console.error('Failed to fetch users/counselors', error)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch blocked users separately so any error doesn't crash the main tab
  const fetchBlockedUsers = async () => {
    try {
      const blockedData = await adminService.getBlockedUsers()
      setBlockedUsers(Array.isArray(blockedData) ? blockedData : [])
    } catch (error) {
      console.error('Failed to fetch blocked users', error)
      setBlockedUsers([])
    }
  }

  useEffect(() => {
    fetchData()
    fetchBlockedUsers()
  }, [])

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                           user.name?.toLowerCase().includes(userSearch.toLowerCase())
      const matchesRisk = userRiskFilter === 'All' || user.riskLevel === userRiskFilter
      return matchesSearch && matchesRisk
    })
  }, [users, userSearch, userRiskFilter])

  // Filter and search counselors
  const filteredCounselors = useMemo(() => {
    return counselors.filter(counselor => {
      const matchesSearch = counselor.email?.toLowerCase().includes(counselorSearch.toLowerCase()) ||
                           counselor.name?.toLowerCase().includes(counselorSearch.toLowerCase())
      const matchesStatus = counselorStatusFilter === 'All' || counselor.status === counselorStatusFilter
      return matchesSearch && matchesStatus
    })
  }, [counselors, counselorSearch, counselorStatusFilter])

  // Filter blocked users
  const filteredBlocked = useMemo(() => {
    return blockedUsers.filter(u =>
      u.email?.toLowerCase().includes(blockedSearch.toLowerCase()) ||
      u.name?.toLowerCase().includes(blockedSearch.toLowerCase())
    )
  }, [blockedUsers, blockedSearch])

  const handleBlockUser = async (userId: string, currentStatus: string) => {
    try {
      setActionLoading(userId)
      const newStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked'
      await adminService.updateUserStatus(userId, newStatus)
      toast.success(`User ${newStatus.toLowerCase()} successfully`)
      fetchData()
      fetchBlockedUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnblockUser = async (userId: string, userName: string) => {
    try {
      setActionLoading(userId)
      await adminService.unblockUser(userId)
      toast.success(`${userName} has been unblocked and report count reset to zero.`)
      fetchData()
      fetchBlockedUsers()
    } catch (error) {
      toast.error('Failed to unblock user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      setActionLoading(userId)
      await adminService.deleteUser(userId)
      toast.success('User deleted successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCounselor = async (counselorId: string) => {
    if (!window.confirm('Are you sure you want to delete this counselor?')) return
    
    try {
      setActionLoading(counselorId)
      await adminService.deleteCounselor(counselorId)
      toast.success('Counselor deleted successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete counselor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await adminService.createUser(newUser)
      toast.success('User created successfully')
      setShowAddModal(false)
      setNewUser({ name: '', email: '', role: 'user', riskLevel: 'Low', password: 'password123' })
      fetchData()
    } catch (error) {
      toast.error('Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  // USER COLUMNS
  const userColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
        }`}>
          {item.status || 'Active'}
        </span>
      )
    },
    { 
      header: 'Risk Level', 
      accessor: 'riskLevel',
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.riskLevel === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
          item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
        }`}>
          {item.riskLevel || 'N/A'}
        </span>
      )
    },
    { header: 'Joined At', accessor: 'joinedAt' },
  ]

  const userActions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => handleBlockUser(item._id || item.id, item.status)}
        disabled={actionLoading === (item._id || item.id)}
        className={`p-1.5 transition-colors ${item.status === 'Blocked' ? 'text-green-500 hover:text-green-600' : 'text-slate-400 hover:text-orange-600 dark:hover:text-orange-500'}`} 
        title={item.status === 'Blocked' ? 'Unblock User' : 'Block User'}
      >
        <ShieldBan className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleDeleteUser(item._id || item.id)}
        disabled={actionLoading === (item._id || item.id)}
        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" 
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  // COUNSELOR COLUMNS
  const counselorColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
          item.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      header: 'Joined Date', 
      accessor: 'joinedAt',
      cell: (item: any) => item.joinedAt || 'Unknown'
    },
  ]

  const counselorActions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => handleDeleteCounselor(item._id || item.id)}
        disabled={actionLoading === (item._id || item.id)}
        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" 
        title="Delete Counselor"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  // BLOCKED USER COLUMNS
  const blockedColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
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
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
          {item.riskLevel}
        </span>
      )
    },
    { header: 'Joined At', accessor: 'joinedAt' },
  ]

  const blockedActions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleUnblockUser(item.id, item.name)}
        disabled={actionLoading === item.id}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 transition-colors disabled:opacity-50"
        title="Unblock User & Reset Reports"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Unblock
      </button>
      <button 
        onClick={() => handleDeleteUser(item.id)}
        disabled={actionLoading === item.id}
        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" 
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="User & Counselor Management" 
        description="Manage platform users, counselors, and blocked accounts."
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'users' 
              ? 'border-lavender-600 text-lavender-600 dark:text-lavender-400' 
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Platform Users ({filteredUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('counselors')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'counselors' 
              ? 'border-lavender-600 text-lavender-600 dark:text-lavender-400' 
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Counselors ({filteredCounselors.length})
        </button>
        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'blocked' 
              ? 'border-red-500 text-red-600 dark:text-red-400' 
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldBan className="w-4 h-4" />
          Blocked Users
          {blockedUsers.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 font-bold">
              {blockedUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 w-full sm:w-64"
                />
              </div>
              
              {/* Risk Level Filter */}
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Risk:</span>
                {['All', 'Low', 'Medium', 'High'].map(risk => (
                  <button
                    key={risk}
                    onClick={() => setUserRiskFilter(risk)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      userRiskFilter === risk
                        ? 'bg-lavender-600 text-white dark:bg-lavender-500'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
            <Button 
              className="bg-lavender-600 hover:bg-lavender-700 text-white border-none"
              onClick={() => setShowAddModal(true)}
            >
              Add New User
            </Button>
          </div>

          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ) : (
            <AdminTable columns={userColumns} data={filteredUsers} actions={userActions} />
          )}
        </div>
      )}

      {/* COUNSELORS TAB */}
      {activeTab === 'counselors' && (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={counselorSearch}
                  onChange={(e) => setCounselorSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status:</span>
                {['All', 'Verified', 'Pending'].map(status => (
                  <button
                    key={status}
                    onClick={() => setCounselorStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      counselorStatusFilter === status
                        ? 'bg-lavender-600 text-white dark:bg-lavender-500'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ) : (
            <AdminTable columns={counselorColumns} data={filteredCounselors} actions={counselorActions} />
          )}
        </div>
      )}

      {/* BLOCKED USERS TAB */}
      {activeTab === 'blocked' && (
        <div>
          {/* Info Banner */}
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldBan className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Blocked Accounts</p>
                <p className="text-red-600 dark:text-red-500 text-xs mt-0.5">
                  These users have been blocked (manually or automatically due to 5+ reports).
                  Clicking <strong>Unblock</strong> will restore their access and reset their report count to zero.
                </p>
              </div>
            </div>
            <button
              onClick={fetchBlockedUsers}
              className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search blocked users..."
                value={blockedSearch}
                onChange={(e) => setBlockedSearch(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 w-full"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ) : filteredBlocked.length === 0 ? (
            <div className="text-center py-16">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">No blocked users</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">All users are currently active on the platform.</p>
            </div>
          ) : (
            <AdminTable columns={blockedColumns} data={filteredBlocked} actions={blockedActions} />
          )}
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Add New User</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500">
                    <option value="user">User</option>
                    <option value="counselor">Counselor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Risk Level</label>
                  <select value={newUser.riskLevel} onChange={(e) => setNewUser({...newUser, riskLevel: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-lavender-600 hover:bg-lavender-700 text-white">
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

