import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Try to authenticate against backend
      const response = await fetch('https://mindheaven-tfbc.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        // Check if user is admin
        if (data.role === 'admin') {
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('adminToken', data.access_token || '')
          localStorage.setItem('adminEmail', email)
          toast.success('Admin access granted')
          navigate('/admin')
        } else {
          toast.error('You do not have admin privileges')
        }
      } else {
        // Fallback to demo credentials if backend is not available
        if (email === 'admin@gmail.com' && (password === 'admin123' || password === 'admin 123')) {
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('adminEmail', email)
          toast.success('Admin access granted')
          navigate('/admin')
        } else {
          toast.error('Invalid admin credentials')
        }
      }
    } catch (error) {
      // Fallback to demo credentials
      if (email === 'admin@gmail.com' && (password === 'admin123' || password === 'admin 123')) {
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('adminEmail', email)
        toast.success('Admin access granted')
        navigate('/admin')
      } else {
        toast.error('Invalid admin credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          &larr; Back to Platform
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Portal</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Secure access for platform administrators
          </p>
        </div>

        <Card className="p-8 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
              isLoading={isLoading}
            >
              Access Portal
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminLogin
