import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar as CalendarIcon, Clock, Video, CheckCircle, XCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { adminService } from '@/services/adminService'

interface Appointment {
  id: string | number;
  user: string;
  counselor: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await adminService.getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error('Failed to fetch appointments from backend:', err);
        // Fallback to localStorage or mock data
        const saved = localStorage.getItem('admin_appointments');
        if (saved) {
          try {
            setAppointments(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        } else {
          setAppointments([
            { id: 1, user: 'Alice Smith', counselor: 'Dr. Sarah Jenkins', date: 'May 23, 2024', time: '10:00 AM', status: 'Upcoming', type: 'Video Call' },
            { id: 2, user: 'Jane Doe', counselor: 'Dr. Emily Chen', date: 'May 23, 2024', time: '02:30 PM', status: 'Pending Approval', type: 'Audio Call' },
            { id: 3, user: 'Bob Johnson', counselor: 'Dr. Sarah Jenkins', date: 'May 22, 2024', time: '09:00 AM', status: 'Completed', type: 'Video Call' },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  const handleAction = async (id: string | number, action: string) => {
    try {
      if (typeof id === 'string') {
        await adminService.updateAppointmentStatus(id, action);
      }
      
      const newStatus = action === 'approved' ? 'Upcoming' : 'Declined';
      toast.success(`Appointment ${action} successfully`);
      
      setAppointments(prev => {
        const updated = prev.map(apt => 
          apt.id === id ? { ...apt, status: newStatus } : apt
        );
        localStorage.setItem('admin_appointments', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update appointment status.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Appointments Management" 
        description="View platform-wide schedules and manage booking approvals."
      />

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <Card key={apt.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Session Details</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{apt.user}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">with {apt.counselor}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Schedule</p>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <CalendarIcon className="w-4 h-4 text-lavender-500" />
                    {apt.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-1">
                    <Clock className="w-4 h-4" />
                    {apt.time}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status & Type</p>
                  <div className="flex flex-col gap-2 items-start">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      apt.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      apt.status === 'Declined' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                    }`}>
                      {apt.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <Video className="w-3 h-3" />
                      {apt.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6 justify-center min-w-[140px]">
                <Button size="sm" variant="outline" className="w-full" onClick={() => setSelectedAppointment(apt)}>
                  View Details
                </Button>
                {apt.status === 'Pending Approval' && (
                  <>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => handleAction(apt.id, 'approved')}>
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-55 border-red-200 gap-2" onClick={() => handleAction(apt.id, 'declined')}>
                      <XCircle className="w-4 h-4" /> Decline
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Appointments</h3>
              <p className="text-slate-500 mt-1">There are no booked appointments scheduled on the platform.</p>
            </div>
          )}
        </div>
      )}

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-lavender-500" />
                  Appointment Details
                </h3>
                <button onClick={() => setSelectedAppointment(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Client Name</label>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedAppointment.user}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Client Email</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{selectedAppointment.user.toLowerCase().replace(' ', '.')}@example.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Counselor</label>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedAppointment.counselor}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Session Type</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      {selectedAppointment.type}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Date</label>
                    <p className="text-sm font-medium text-slate-850 dark:text-slate-200 mt-0.5">{selectedAppointment.date}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Time</label>
                    <p className="text-sm font-medium text-slate-850 dark:text-slate-200 mt-0.5">{selectedAppointment.time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Status</label>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedAppointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      selectedAppointment.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      selectedAppointment.status === 'Declined' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                    }`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Session Rate</label>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">$120 / hour</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                  <label className="block text-xs font-medium text-slate-500">Session Notes</label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-3 rounded-lg mt-1 border border-slate-100 dark:border-slate-850">
                    "Client requested support regarding managing workplace stress and setting boundaries. Recommended breathing exercises and basic mindfulness routines."
                  </p>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
                  <Button onClick={() => setSelectedAppointment(null)} className="bg-lavender-600 hover:bg-lavender-700 text-white border-none">
                    Close Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

