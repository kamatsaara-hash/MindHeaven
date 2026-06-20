import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, User, FileText, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { apiService } from '@/services/api'
import { toast } from 'react-hot-toast'
import { fadeInUp } from '@/animations/variants'

const ReportUser = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const queryUserId = searchParams.get('userId')
  const queryName = searchParams.get('name')

  const [users, setUsers] = useState<{ id: string; nickname: string }[]>([])
  const [selectedUserId, setSelectedUserId] = useState(queryUserId || '')
  const [reason, setReason] = useState('Harassment')
  const [customReason, setCustomReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!queryUserId) {
      const fetchUsers = async () => {
        try {
          setIsLoadingUsers(true)
          const data = await apiService.getUsersForReporting()
          setUsers(data)
        } catch (error) {
          toast.error('Failed to load user list')
        } finally {
          setIsLoadingUsers(false)
        }
      }
      fetchUsers()
    }
  }, [queryUserId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId) {
      toast.error('Please select a user to report')
      return
    }

    const finalReason = reason === 'Other' ? customReason : reason
    if (reason === 'Other' && !customReason.trim()) {
      toast.error('Please specify the reason')
      return
    }

    if (!description.trim()) {
      toast.error('Please provide a description of the issue')
      return
    }

    try {
      setIsSubmitting(true)
      await apiService.reportContent(selectedUserId, 'user', finalReason, description)
      toast.success('Report submitted successfully. Our moderation team will review it.')
      navigate('/community')
    } catch (error) {
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter((u) =>
    u.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-lavender-500 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Report a User</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Help us maintain a supportive and safe space. Please report behavior that violates our community guidelines.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card variant="glass" className="p-8 border border-slate-200/50 dark:border-slate-800/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* User Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-350 flex items-center gap-2">
                <User className="w-4 h-4 text-lavender-500" />
                Target User
              </label>
              
              {queryUserId ? (
                // Locked User display
                <div className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                  {queryName}
                </div>
              ) : (
                // Searchable select dropdown
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-sm"
                  />
                  {isLoadingUsers ? (
                    <p className="text-xs text-slate-500 animate-pulse">Loading users...</p>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                      required
                    >
                      <option value="">-- Select user to report --</option>
                      {filteredUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nickname}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Violation Reason */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-350 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-lavender-500" />
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
              >
                <option value="Harassment">Harassment or Bullying</option>
                <option value="Hate Speech">Hate Speech</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Self-Harm / Crisis">Self-Harm / Crisis Mention</option>
                <option value="Spam">Spam or Scams</option>
                <option value="Other">Other...</option>
              </select>
            </div>

            {/* Custom Reason */}
            {reason === 'Other' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-350">
                  Please specify reason
                </label>
                <input
                  type="text"
                  required
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="e.g., Aggressive messaging"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                />
              </motion.div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-350 flex items-center gap-2">
                <FileText className="w-4 h-4 text-lavender-500" />
                Details / Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the behavior or provide context (e.g. details of posts/comments, specific dates/times)..."
                rows={5}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-lavender-500 resize-none text-slate-800 dark:text-slate-200"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full sm:w-auto"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-750 text-white border-none flex items-center justify-center gap-2"
                isLoading={isSubmitting}
              >
                <CheckCircle className="w-4 h-4" />
                Submit Report
              </Button>
            </div>

          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default ReportUser
