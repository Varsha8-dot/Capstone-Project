import { useAuth } from '../store/authStore'
import { Navigate } from 'react-router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please login first')
    }
  }, [loading, isAuthenticated])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace state={{ redirectTo: '/' }} />
  }

  return children
}

export default ProtectedRoute