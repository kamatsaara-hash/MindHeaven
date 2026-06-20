import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Send, Bell, Users, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Send Notifications" 
        description="Push announcements, motivational messages, or event updates to users."
      />

      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Target Audience</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="radio" name="audience" className="text-lavender-600 focus:ring-lavender-500" defaultChecked />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">All Users</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="radio" name="audience" className="text-lavender-600 focus:ring-lavender-500" />
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Counselors</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="radio" name="audience" className="text-lavender-600 focus:ring-lavender-500" />
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Specific Users</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Notification Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
              placeholder="e.g., Weekly Wellness Webinar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Message Content</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white resize-none"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => toast.success('Draft saved')}>Save Draft</Button>
            <Button type="button" className="bg-lavender-600 hover:bg-lavender-700 text-white border-none gap-2" onClick={() => toast.success('Notification sent successfully')}>
              <Send className="w-4 h-4" />
              Send Notification
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
