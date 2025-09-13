import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { decodeJWT } from '../lib/jwt'

type Role = 'admin' | 'user' | 'viewer'
type Props = { role: Role | Role[]; children: ReactNode }

export default function RequireRole({ role, children }: Props) {
  const location = useLocation()
  const token = localStorage.getItem('cinehub.token')
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />

  // Lấy role ưu tiên từ JWT
  const payload = decodeJWT(token)
  let myRole: Role = (payload?.role as Role) || 'viewer'

  // Fallback từ localStorage.cinehub.user nếu có
  try {
    const cached = JSON.parse(localStorage.getItem('cinehub.user') || '{}')
    if (!myRole && cached?.role) myRole = cached.role
  } catch {}

  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(myRole)) return <Navigate to="/403" replace />
  return <>{children}</>
}
