import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Star, Reply, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FeedbackSupport() {
  const tickets = [
    { id: '#1042', user: 'Mark D.', subject: 'Issue with video call audio', status: 'Open', priority: 'High', date: '2 hrs ago' },
    { id: '#1041', user: 'Sarah W.', subject: 'Feature Request: Mood Tracker', status: 'Resolved', priority: 'Low', date: '1 day ago' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Feedback & Support" 
        description="Manage user complaints, technical support tickets, and platform feedback."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {tickets.map((ticket, idx) => (
            <Card key={idx} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-slate-500">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      ticket.status === 'Open' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                      'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-slate-500">{ticket.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">From: {ticket.user}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success('Reply dialog opened')}>
                    <Reply className="w-4 h-4" /> Reply
                  </Button>
                  {ticket.status === 'Open' && (
                    <Button variant="outline" size="sm" className="gap-2 text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50" onClick={() => toast.success('Ticket marked as resolved')}>
                      <CheckCircle2 className="w-4 h-4" /> Resolve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Average Satisfaction</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">4.8</span>
              </div>
              <p className="text-sm text-slate-500">Based on 1,240 reviews</p>
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 w-12 text-slate-600 dark:text-slate-400">
                    {rating} <Star className="w-3 h-3" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : rating === 3 ? 3 : 1}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
