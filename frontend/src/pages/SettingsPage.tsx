import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    emailUpdates: true,
    twoFactorAuth: false,
    profileVisibility: 'anonymous',
  })

  const handleToggle = (key: keyof Omit<typeof settings, 'profileVisibility'>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Manage your preferences and account</p>
      </motion.div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-lavender-500" />
                <div>
                  <h3 className="font-bold">Dark Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Toggle dark theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDark ? 'bg-lavender-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDark ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card variant="glass">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-lavender-500" />
              <h3 className="font-bold text-lg">Notifications</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: 'emailNotifications',
                  label: 'Email Notifications',
                  desc: 'Receive email updates on community posts',
                },
                {
                  key: 'pushNotifications',
                  label: 'Push Notifications',
                  desc: 'Receive push notifications on your devices',
                },
                {
                  key: 'emailUpdates',
                  label: 'Email Updates',
                  desc: 'Get weekly newsletter with resources',
                },
              ].map((notif) => (
                <motion.div
                  key={notif.key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{notif.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(notif.key as any)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings[notif.key as keyof typeof settings] ? 'bg-lavender-500' : 'bg-slate-400'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings[notif.key as keyof typeof settings] ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card variant="glass">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-lavender-500" />
              <h3 className="font-bold text-lg">Privacy & Security</h3>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                <p className="font-medium mb-3">Profile Visibility</p>
                <div className="flex gap-2">
                  {['Anonymous', 'Friends Only', 'Public'].map((option) => (
                    <button
                      key={option}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        settings.profileVisibility === option.toLowerCase().replace(' ', '')
                          ? 'bg-lavender-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactorAuth')}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Button variant="primary" size="lg" className="w-full md:w-auto">
            Save Settings
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage
