import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldAlert,
  ShieldBan,
  Activity,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  HeartHandshake,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  LogOut,
  Heart,
} from 'lucide-react';
import { adminService } from '@/services/adminService';

// Navigation items; `badge` indicates the item should display the blocked users count.
const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'User Management', icon: Users },
  { path: '/admin/counselors', label: 'Counselors', icon: UserCheck },
  { path: '/admin/moderation', label: 'Community Moderation', icon: ShieldAlert },
  { path: '/admin/crisis', label: 'Crisis Monitoring', icon: Activity },
  { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { path: '/admin/content', label: 'Content Management', icon: FileText },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/resources', label: 'Resources & Helplines', icon: HeartHandshake },
  { path: '/admin/reports', label: 'Reports', icon: FileSpreadsheet },
  { path: '/admin/blocked', label: 'Blocklist', icon: ShieldBan, badge: true },
  { path: '/admin/feedback', label: 'Feedback & Support', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const [blockedCount, setBlockedCount] = useState(0);

  // Fetch blocked users count on mount and when the admin navigates back to this page.
  useEffect(() => {
    adminService
      .getBlockedUsers()
      .then((data) => setBlockedCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setBlockedCount(0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
          <Heart className="w-6 h-6 text-lavender-500" />
          <span>MindHaven</span>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1 font-semibold tracking-wide">
            ADMIN
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? item.badge
                      ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
                      : 'bg-lavender-50 dark:bg-lavender-500/10 text-lavender-700 dark:text-lavender-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className={`w-5 h-5 ${item.badge && blockedCount > 0 ? 'text-red-500' : ''}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && blockedCount > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-red-500 text-white font-bold min-w-[20px] text-center">
                  {blockedCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Heart className="w-5 h-5 text-lavender-500" />
          User Portal
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout Admin
        </button>
      </div>
    </aside>
  );
};
