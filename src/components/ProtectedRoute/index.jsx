import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function ProtectedRoute({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return null

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
