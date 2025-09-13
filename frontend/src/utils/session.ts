import { decodeJWT } from '../lib/jwt'
export type Role = 'admin' | 'viewer'

export function getSession() {
  const token = localStorage.getItem('cinehub.token') || ''
  const payload = decodeJWT(token)
  const id = (payload?.id as number | undefined)
  const role = (payload?.role as Role | undefined) ?? 'viewer'
  return {
    token,
    id,
    role,
    isAuthenticated: Boolean(token),
    isAdmin: role === 'admin',
  }
}
