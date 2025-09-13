import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../lib/auth'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const s = getSession();
  const loc = useLocation();
  if (!s.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: loc }} />
  }
  return <>{children}</>
}
