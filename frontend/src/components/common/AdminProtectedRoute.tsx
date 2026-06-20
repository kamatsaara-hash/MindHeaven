import { Navigate } from 'react-router-dom'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
