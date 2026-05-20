import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )

  if (!token || !isAuthenticated) {
    // Not logged in -> Redirect to login page
    return <Navigate to="/" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role.toUpperCase())) {
    // Logged in but has incorrect role -> Redirect to correct default dashboard
    if (user.role.toUpperCase() === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/user/dashboard" replace />
    }
  }

  // Authorized -> Render page
  return <Outlet />
}

export default ProtectedRoute
