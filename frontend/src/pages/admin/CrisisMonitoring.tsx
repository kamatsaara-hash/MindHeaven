import { useEffect, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Activity, PhoneCall, Bot, ShieldAlert, X, Heart, UserCheck, HelpCircle } from 'lucide-react'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { adminService } from '@/services/adminService'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CrisisMonitoring() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [counselors, setCounselors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)
  
  // Modals state
  const [showProtocolModal, setShowProtocolModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null)
  const [selectedCounselor, setSelectedCounselor] = useState<string>('')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await adminService.getCrisisAlerts()
        // Filter out dismissed alerts for the active live feed
        setAlerts(data.filter((a: any) => a.status !== 'dismissed'))
      } catch (error) {
        console.error('Failed to fetch crisis alerts', error)
        toast.error('Failed to load crisis alerts')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCounselors = async () => {
      try {
        const data = await adminService.getCounselors()
        setCounselors(data)
      } catch (error) {
        console.error('Failed to fetch counselors', error)
      }
    }

    fetchAlerts()
    fetchCounselors()
  }, [])

  const handleDismiss = async (alertId: string) => {
    try {
      setIsActionLoading(alertId)
      await adminService.handleCrisisAction(alertId, 'Dismiss')
      toast.success('Crisis alert dismissed')
      setAlerts(prev => prev.filter(a => a.id !== alertId))
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
      toast.error('Failed to dismiss alert')
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleAssignClick = (alert: any) => {
    setSelectedAlert(alert)
    setShowAssignModal(true)
    if (counselors.length > 0) {
      setSelectedCounselor(counselors[0].name)
    } else {
      setSelectedCounselor('')
    }
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAlert || !selectedCounselor) return

    try {
      setIsActionLoading(selectedAlert.id)
      await adminService.handleCrisisAction(selectedAlert.id, 'Assign Counselor', selectedCounselor)
      toast.success(`Counselor ${selectedCounselor} assigned successfully`)
      
      setAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id 
          ? { ...a, status: 'assigned', assignedCounselor: selectedCounselor } 
          : a
      ))
      
      setShowAssignModal(false)
      setSelectedAlert(null)
    } catch (error) {
      console.error('Failed to assign counselor:', error)
      toast.error('Failed to assign counselor')
    } finally {
      setIsActionLoading(null)
    }
  }

  // Count high risk alerts in state
  const highRiskCount = alerts.filter(a => a.risk === 'High' && a.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Crisis Monitoring" 
        description="Real-time AI sentiment analysis and emergency keyword detection alerts."
        action={
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white border-none gap-2 animate-pulse" 
            onClick={() => setShowProtocolModal(true)}
          >
            <PhoneCall className="w-4 h-4" />
            Emergency Protocols
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminStatCard
          title="Active High-Risk Alerts"
          value={highRiskCount.toString()}
          icon={<AlertTriangle className="w-6 h-6" />}
          colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
        />
        <AdminStatCard
          title="Avg. Sentiment Score"
          value="68/100"
          icon={<Bot className="w-6 h-6" />}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <AdminStatCard
          title="Interventions Today"
          value="12"
          icon={<ShieldAlert className="w-6 h-6" />}
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Live Detection Feed
        </h3>
        
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {alerts.map(alert => (
              <Card 
                key={alert.id} 
                className={`p-5 border-l-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center transition-all duration-300 ${
                  alert.risk === 'High' ? 'border-l-red-500' : 'border-l-amber-500'
                }`}
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">{alert.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.risk === 'High'
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {alert.risk} Risk
                    </span>
                    <span className="text-sm text-slate-500">{alert.time || 'Just now'}</span>
                    
                    {alert.status === 'assigned' && (
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Assigned to {alert.assignedCounselor}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">User: <span className="font-medium">{alert.user}</span></p>
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30 text-slate-700 dark:text-slate-300 italic text-sm">
                    "{alert.content}"
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                  <Button 
                    className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100" 
                    onClick={() => handleAssignClick(alert)}
                    disabled={!!isActionLoading}
                  >
                    {alert.status === 'assigned' ? 'Reassign' : 'Assign Counselor'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20" 
                    onClick={() => handleDismiss(alert.id)}
                    isLoading={isActionLoading === alert.id}
                    disabled={!!isActionLoading}
                  >
                    Dismiss
                  </Button>
                </div>
              </Card>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">All Clear!</h3>
                <p className="text-slate-500 mt-1">There are no active high-risk detections to monitor right now.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assign Counselor Modal */}
      <AnimatePresence>
        {showAssignModal && selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <UserCheck className="w-5 h-5 text-lavender-500" />
                  Assign Counselor
                </h3>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAssignSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Alert Context</label>
                  <p className="text-sm italic p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 rounded-lg text-slate-600 dark:text-slate-400">
                    "{selectedAlert.content}"
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Select Counselor</label>
                  {counselors.length === 0 ? (
                    <p className="text-sm text-red-500 italic">No counselors available. Please verify counselor profiles first.</p>
                  ) : (
                    <select
                      value={selectedCounselor}
                      onChange={(e) => setSelectedCounselor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                    >
                      {counselors.map((c: any) => (
                        <option key={c.id} value={c.name}>
                          {c.name} - {c.specialization} ({c.status})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={!selectedCounselor} className="bg-lavender-600 hover:bg-lavender-700 text-white border-none">
                    Confirm Assignment
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Protocols Modal */}
      <AnimatePresence>
        {showProtocolModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  Emergency Protocols Guide
                </h3>
                <button onClick={() => setShowProtocolModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg">
                  <h4 className="font-bold text-sm text-red-700 dark:text-red-300 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Immediate Threat Action
                  </h4>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    If an alert shows imminent intent for self-harm or violence, immediately dispatch alerts to counselors and contact local wellness support services.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Active Support Hotlines</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                      <span className="font-semibold block text-slate-900 dark:text-white">US National Suicide Lifeline</span>
                      <span className="text-lavender-500 font-bold block mt-1">988</span>
                      <span className="text-slate-400">Call/Text (24/7)</span>
                    </div>
                    
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                      <span className="font-semibold block text-slate-900 dark:text-white">US Crisis Text Line</span>
                      <span className="text-lavender-500 font-bold block mt-1">Text HOME to 741741</span>
                      <span className="text-slate-400">SMS Support (24/7)</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                      <span className="font-semibold block text-slate-900 dark:text-white">UK NHS Mental Health</span>
                      <span className="text-lavender-500 font-bold block mt-1">111</span>
                      <span className="text-slate-400">Call Line</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                      <span className="font-semibold block text-slate-900 dark:text-white">International Gateways</span>
                      <span className="text-lavender-500 font-bold block mt-1">befrienders.org</span>
                      <span className="text-slate-400">Web Portal Help</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-1">Moderator Intervention Steps</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Identify the severity level of the alert based on wording/pattern.</li>
                    <li>Assign an available verified counselor specializing in the alert type.</li>
                    <li>Send an automated warning/notification offering support links if user is direct messageable.</li>
                    <li>For extreme cases, contact local services with details (IP / email registration details).</li>
                  </ol>
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Refer to Admin Guide for legal details.
                </span>
                <Button 
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border-none"
                  onClick={() => setShowProtocolModal(false)}
                >
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
