import { useEffect, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/Button'
import { Search, Filter, CheckCircle2, XCircle, Star, Mail, Phone, X, Briefcase, Award, Clock, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function CounselorManagement() {
  const [counselors, setCounselors] = useState<any[]>([])
  const [filteredCounselors, setFilteredCounselors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending Verification' | 'Rejected'>('All')
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCounselor, setNewCounselor] = useState({
    name: '',
    email: '',
    specialization: '',
    bio: '',
    qualifications: '',
    phone: '',
    availability: '',
    hourly_rate: 0,
    password: 'counselor123'
  })

  const fetchCounselors = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getCounselors()
      setCounselors(data)
      setFilteredCounselors(data)
    } catch (error) {
      console.error('Failed to fetch counselors', error)
      toast.error('Failed to fetch counselors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCounselors()
  }, [])

  // Filter counselors based on search and status
  useEffect(() => {
    let filtered = counselors
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    
    setFilteredCounselors(filtered)
  }, [searchTerm, statusFilter, counselors])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setActionLoading(id)
      await adminService.updateUserStatus(id, status)
      toast.success(`Counselor ${status.toLowerCase()} successfully`)
      fetchCounselors()
    } catch (error) {
      toast.error(`Failed to ${status === 'Verified' ? 'approve' : 'reject'} counselor`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCounselor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this counselor?')) return

    try {
      setActionLoading(id)
      await adminService.deleteCounselor(id)
      toast.success('Counselor deleted successfully')
      fetchCounselors()
    } catch (error) {
      toast.error('Failed to delete counselor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const qualificationsArray = newCounselor.qualifications
        ? newCounselor.qualifications.split(',').map((q: string) => q.trim()).filter(Boolean)
        : []

      await adminService.createCounselor({
        ...newCounselor,
        qualifications: qualificationsArray,
        hourly_rate: Number(newCounselor.hourly_rate)
      })
      toast.success('Counselor created successfully')
      setShowAddModal(false)
      setNewCounselor({
        name: '',
        email: '',
        specialization: '',
        bio: '',
        qualifications: '',
        phone: '',
        availability: '',
        hourly_rate: 0,
        password: 'counselor123'
      })
      fetchCounselors()
    } catch (error) {
      toast.error('Failed to create counselor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (item: any) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-slate-500">{item.email}</p>
        </div>
      )
    },
    { 
      header: 'Specialization', 
      accessor: 'specialization',
      cell: (item: any) => (
        <span className="inline-block bg-lavender-100 dark:bg-lavender-500/20 text-lavender-700 dark:text-lavender-300 px-2 py-1 rounded text-sm">
          {item.specialization}
        </span>
      )
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      cell: (item: any) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{item.rating ? item.rating.toFixed(1) : '0.0'}</span>
          <span className="text-xs text-slate-500">({item.reviews || 0} reviews)</span>
        </div>
      )
    },
    { 
      header: 'Sessions', 
      accessor: 'sessionsCompleted',
      cell: (item: any) => <span className="font-medium">{item.sessionsCompleted || 0}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
          item.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
        }`}>
          {item.status}
        </span>
      )
    },
  ]

  const actionCell = (item: any) => (
    <div className="flex justify-end gap-2 items-center">
      {item.status === 'Pending Verification' ? (
        <>
          <button 
            className="p-1.5 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50" 
            title="Approve"
            disabled={actionLoading === (item.id || item._id)}
            onClick={() => handleUpdateStatus(item.id || item._id, 'Verified')}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50" 
            title="Reject"
            disabled={actionLoading === (item.id || item._id)}
            onClick={() => handleUpdateStatus(item.id || item._id, 'Rejected')}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white dark:bg-slate-900 text-lavender-600 hover:text-lavender-700 border-lavender-200"
          onClick={() => setSelectedCounselor(item)}
        >
          View
        </Button>
      )}
      <button 
        onClick={() => handleDeleteCounselor(item.id || item._id)}
        disabled={actionLoading === (item.id || item._id)}
        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" 
        title="Delete Counselor"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Counselor Management" 
        description="Verify counselor profiles, view schedules, and manage professional access."
        action={
          <Button 
            className="bg-lavender-600 hover:bg-lavender-700 text-white border-none flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Add Counselor
          </Button>
        }
      />
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search counselors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'All' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('All')}
              className={statusFilter === 'All' ? "" : "bg-white dark:bg-slate-900"}
            >
              <Filter className="w-4 h-4 mr-1" />
              All
            </Button>
            <Button 
              variant={statusFilter === 'Verified' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('Verified')}
              className={statusFilter === 'Verified' ? "" : "bg-white dark:bg-slate-900"}
            >
              Verified
            </Button>
            <Button 
              variant={statusFilter === 'Pending Verification' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('Pending Verification')}
              className={statusFilter === 'Pending Verification' ? "" : "bg-white dark:bg-slate-900"}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500 mb-4">
        Showing {filteredCounselors.length} of {counselors.length} counselors
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      ) : filteredCounselors.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No counselors found matching your criteria
        </div>
      ) : (
        <AdminTable columns={columns} data={filteredCounselors} actions={actionCell} />
      )}

      {/* Counselor Details Modal */}
      <AnimatePresence>
        {selectedCounselor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCounselor.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{selectedCounselor.specialization}</p>
                </div>
                <button 
                  onClick={() => setSelectedCounselor(null)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                
                {/* Bio / Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-lavender-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Experience & Bio</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedCounselor.bio || 'No bio provided'}
                  </p>
                </div>

                {/* Qualifications */}
                {selectedCounselor.qualifications && selectedCounselor.qualifications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-lavender-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Qualifications</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedCounselor.qualifications.map((qual: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <span className="text-lavender-600 mt-1">•</span>
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Mail className="w-5 h-5 text-lavender-600" />
                      <span>{selectedCounselor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Phone className="w-5 h-5 text-lavender-600" />
                      <span>{selectedCounselor.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Ratings & Reviews */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Ratings & Reviews</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedCounselor.rating ? selectedCounselor.rating.toFixed(1) : '0.0'} / 5.0
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Based on {selectedCounselor.reviews || 0} client reviews
                    </p>
                  </div>
                </div>

                {/* Session Statistics */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-lavender-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Session Statistics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-lavender-50 dark:bg-lavender-500/10 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sessions Completed</p>
                      <p className="text-2xl font-bold text-lavender-600">{selectedCounselor.sessionsCompleted || 0}</p>
                    </div>
                    <div className="bg-lavender-50 dark:bg-lavender-500/10 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Hourly Rate</p>
                      <p className="text-2xl font-bold text-lavender-600">₹{selectedCounselor.hourly_rate || selectedCounselor.hourlyRate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                {selectedCounselor.availability && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Availability</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedCounselor.availability}
                    </p>
                  </div>
                )}

                {/* Status Badge */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Status</h3>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                    selectedCounselor.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                    selectedCounselor.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                  }`}>
                    {selectedCounselor.status}
                  </span>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCounselor(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Counselor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-8"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Add New Counselor</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateCounselor} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input required type="text" value={newCounselor.name} onChange={(e) => setNewCounselor({...newCounselor, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input required type="email" value={newCounselor.email} onChange={(e) => setNewCounselor({...newCounselor, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialization</label>
                    <input required type="text" placeholder="e.g. Anxiety, Stress Management" value={newCounselor.specialization} onChange={(e) => setNewCounselor({...newCounselor, specialization: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Qualifications</label>
                    <input required type="text" placeholder="e.g. M.Sc. Clinical Psychology, PhD" value={newCounselor.qualifications} onChange={(e) => setNewCounselor({...newCounselor, qualifications: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea rows={3} value={newCounselor.bio} onChange={(e) => setNewCounselor({...newCounselor, bio: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" placeholder="Describe background and expertise..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="text" value={newCounselor.phone} onChange={(e) => setNewCounselor({...newCounselor, phone: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Availability</label>
                    <input type="text" placeholder="e.g. Mon-Fri 9AM-5PM" value={newCounselor.availability} onChange={(e) => setNewCounselor({...newCounselor, availability: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hourly Rate (₹)</label>
                    <input type="number" min={0} value={newCounselor.hourly_rate} onChange={(e) => setNewCounselor({...newCounselor, hourly_rate: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input required type="password" value={newCounselor.password} onChange={(e) => setNewCounselor({...newCounselor, password: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-lavender-600 hover:bg-lavender-700 text-white">
                    {isSubmitting ? 'Creating...' : 'Create Counselor'}
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
