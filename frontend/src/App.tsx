import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout from './layouts/MainLayout'
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import CommunityPage from './pages/CommunityPage'
import ResourcesPage from './pages/ResourcesPage'
import ProfessionalHelpPage from './pages/ProfessionalHelpPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ReportUser from './pages/ReportUser'

// Context
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

// Admin
import AdminLayout from './layouts/AdminLayout'
import { AdminProtectedRoute } from './components/common/AdminProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboardPage from './pages/admin/DashboardPage'
import UserManagement from './pages/admin/UserManagement'
import CounselorManagement from './pages/admin/CounselorManagement'
import CommunityModeration from './pages/admin/CommunityModeration'
import CrisisMonitoring from './pages/admin/CrisisMonitoring'
import Appointments from './pages/admin/Appointments'
import ContentManagement from './pages/admin/ContentManagement'
import Analytics from './pages/admin/Analytics'
import Notifications from './pages/admin/Notifications'
import ResourcesHelplines from './pages/admin/ResourcesHelplines'
import FeedbackSupport from './pages/admin/FeedbackSupport'
import Reports from './pages/admin/Reports'
import AdminSettingsPage from './pages/admin/Settings'
import BlockedUsers from './pages/admin/BlockedUsers'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
              <Route path="/professional-help" element={<ProtectedRoute><ProfessionalHelpPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/report-user" element={<ProtectedRoute><ReportUser /></ProtectedRoute>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="counselors" element={<CounselorManagement />} />
              <Route path="moderation" element={<CommunityModeration />} />
              <Route path="crisis" element={<CrisisMonitoring />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="resources" element={<ResourcesHelplines />} />
              <Route path="reports" element={<Reports />} />
              <Route path="blocked" element={<BlockedUsers />} />
              <Route path="feedback" element={<FeedbackSupport />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}
