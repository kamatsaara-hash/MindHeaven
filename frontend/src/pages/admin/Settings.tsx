import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shield, User, Bell, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Admin Settings" 
        description="Manage your admin profile, security preferences, and platform configurations."
      />

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-lavender-600 dark:text-lavender-400" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Profile Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" defaultValue="System Admin" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" defaultValue="admin@gmail.com" disabled className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 cursor-not-allowed" />
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-lavender-600 hover:bg-lavender-700 text-white border-none" onClick={() => toast.success('Profile settings saved')}>Save Changes</Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Security (2FA)</h3>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your admin account.</p>
            </div>
            <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/20" onClick={() => toast.success('2FA Setup initiated')}>
              Enable 2FA
            </Button>
          </div>
        </Card>

        {/* Platform Customization */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Platform Branding</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Manage colors, logos, and global UI elements (Coming soon in next release).</p>
          <Button variant="outline" disabled>Customize Theme</Button>
        </Card>
      </div>
    </div>
  )
}
