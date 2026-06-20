import { useEffect, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/Button'
import { ShieldAlert, Trash2, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommunityModeration() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showHighPriorityOnly, setShowHighPriorityOnly] = useState(false)
  const [showWarnModal, setShowWarnModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [warningReason, setWarningReason] = useState('Harassment')
  const [customWarning, setCustomWarning] = useState('')
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await adminService.getReportedPosts()
        setReports(data)
      } catch (error) {
        console.error('Failed to fetch reports', error)
        toast.error('Failed to fetch reported content')
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  const handleAction = async (reportId: string, action: string, reason?: string) => {
    try {
      setIsActionLoading(reportId)
      await adminService.handleReportAction(reportId, action, reason)
      toast.success(`Action "${action}" completed successfully`)
      // Remove the report from the list to show immediate feedback
      setReports(prev => prev.filter(r => r.id !== reportId))
    } catch (error) {
      console.error('Failed to process report action:', error)
      toast.error('Failed to perform moderation action')
    } finally {
      setIsActionLoading(null)
      setShowWarnModal(false)
      setSelectedReport(null)
    }
  }

  const handleWarnUserClick = (report: any) => {
    setSelectedReport(report)
    setShowWarnModal(true)
    setWarningReason('Harassment')
    setCustomWarning('')
  }

  const handleWarnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReport) return
    const finalReason = warningReason === 'Other' ? customWarning : warningReason
    handleAction(selectedReport.id, 'Warn User', finalReason)
  }

  const filteredReports = showHighPriorityOnly
    ? reports.filter(r => r.riskTag === 'High')
    : reports

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Community Moderation" 
        description="Review reported posts, manage flagged content, and maintain community guidelines."
        action={
          <Button 
            className={`gap-2 border-none transition-all duration-300 ${
              showHighPriorityOnly 
                ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`} 
            onClick={() => setShowHighPriorityOnly(!showHighPriorityOnly)}
          >
            <AlertTriangle className="w-4 h-4" />
            {showHighPriorityOnly ? 'Show All Reports' : 'Review High Priority'}
          </Button>
        }
      />

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{report.author}</h3>
                  <span className="text-xs text-slate-500">
                    {report.reportedAt ? format(new Date(report.reportedAt), 'MMM d, yyyy h:mm a') : 'Unknown Date'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    report.riskTag === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                    report.riskTag === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {report.riskTag} Risk
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg italic">
                  "{report.content}"
                </p>
              </div>
              <div className="flex flex-row sm:flex-col justify-end gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/20 justify-start"
                  onClick={() => handleAction(report.id, 'Keep Post')}
                  isLoading={isActionLoading === report.id}
                  disabled={!!isActionLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Keep Post
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20 justify-start"
                  onClick={() => handleAction(report.id, 'Remove Post')}
                  isLoading={isActionLoading === report.id}
                  disabled={!!isActionLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Post
                </Button>
                <Button 
                  variant="outline" 
                  className="text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 justify-start"
                  onClick={() => handleWarnUserClick(report)}
                  disabled={!!isActionLoading}
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Warn User
                </Button>
              </div>
            </Card>
          ))}
          {filteredReports.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">All caught up!</h3>
              <p className="text-slate-500 mt-1">There are no reported posts matching your filters right now.</p>
            </div>
          )}
        </div>
      )}

      {/* Warn User Modal */}
      <AnimatePresence>
        {showWarnModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Issue Warning to User
                </h3>
                <button onClick={() => setShowWarnModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleWarnSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Target User</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedReport.author} 
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Offending Content</label>
                  <p className="text-sm italic p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 rounded-lg text-slate-600 dark:text-slate-400">
                    "{selectedReport.content}"
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Violation Category</label>
                  <select 
                    value={warningReason} 
                    onChange={(e) => setWarningReason(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                  >
                    <option value="Harassment">Harassment or Bullying</option>
                    <option value="Hate Speech">Hate Speech</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Self-Harm / Crisis">Self-Harm / Crisis Mention</option>
                    <option value="Spam">Spam or Scams</option>
                    <option value="Other">Other Reason...</option>
                  </select>
                </div>
                {warningReason === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Specify Reason</label>
                    <input 
                      required 
                      type="text" 
                      value={customWarning} 
                      onChange={(e) => setCustomWarning(e.target.value)} 
                      placeholder="e.g., Aggressive language in support thread" 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                    />
                  </div>
                )}
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowWarnModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white border-none">
                    Send Warning & Resolve
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
