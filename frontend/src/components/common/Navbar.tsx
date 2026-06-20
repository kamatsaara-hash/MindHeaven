import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Moon, Sun, Heart } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '../ui/Button'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: 'Community', path: '/community' },
    { label: 'Resources', path: '/resources' },
    { label: 'Professional Help', path: '/professional-help' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Report User', path: '/report-user' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-slate-800/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gradient">
            <Heart className="w-8 h-8 text-baby-pink-500" />
            MindHaven
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.filter(item => isAuthenticated || item.label === 'Home').map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors ${
                  location.pathname === path
                    ? 'text-lavender-600 dark:text-lavender-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-lavender-600 dark:hover:text-lavender-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{user?.nickname}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2"
          >
            {navItems.filter(item => isAuthenticated || item.label === 'Home').map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-lavender-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
