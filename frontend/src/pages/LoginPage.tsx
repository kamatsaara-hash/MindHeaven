import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, Heart, Eye, EyeOff, ShieldOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [blockedAccount, setBlockedAccount] = useState(false)
  const { login, guestLogin, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlockedAccount(false)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error: any) {
      const detail = error.response?.data?.detail || ''
      if (error.response?.status === 403 && detail.includes('blocked')) {
        setBlockedAccount(true)
      } else {
        toast.error(detail || 'Failed to login')
      }
    }
  }

  const handleGuest = async () => {
    try {
      await guestLogin()
      toast.success('Joined anonymously')
      navigate('/community')
    } catch (error) {
      toast.error('Failed to join anonymously')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gradient mb-2">
            <Heart className="w-8 h-8 text-baby-pink-500" />
            MindHaven
          </Link>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Log in to continue your mental health journey
          </p>
        </div>

        <Card variant="glass" className="p-8">
          {/* Blocked Account Banner */}
          {blockedAccount && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
            >
              <ShieldOff className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-600 dark:text-red-400">Your account is blocked</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">
                  Your account has been blocked due to community guideline violations. Please contact the admin to appeal.
                </p>
              </div>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500"
                  placeholder="Enter your password"
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
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={handleGuest}
              disabled={isLoading}
            >
              Join Anonymously
            </Button>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-lavender-600 dark:text-lavender-400 hover:underline">
                Sign up
              </Link>
            </p>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Are you an admin?{' '}
              <Link to="/admin/login" className="text-slate-500 dark:text-slate-400 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage
