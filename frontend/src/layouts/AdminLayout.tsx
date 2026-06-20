import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopNav } from '@/components/admin/AdminTopNav'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <AdminTopNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
