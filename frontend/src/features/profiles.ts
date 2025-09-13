import api from '../api'
import { getSession } from '../lib/auth'

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

function wrap<T>(p: Promise<T>): Promise<T> {
  return p.catch((e:any) => {
    if (e?.status === 404 || (e?.body?.message || '').includes('Route not found')) {
      e.message = 'Profiles endpoint is not available on backend (Route not found). Please update API path or enable route.'
    }
    throw e
  })
}

export async function getProfile(id: number) {
  ensureAuth()
  return wrap(api.getApiV1ProfilesById(id))
}

export async function createProfile(body: { name: string; maturity_level?: string | null }) {
  ensureAuth()
  return wrap(api.postApiV1Profiles(body))
}

export async function updateProfile(id: number, body: { name?: string; maturity_level?: string | null }) {
  ensureAuth()
  return wrap(api.putApiV1ProfilesById(id, body))
}

export async function deleteProfile(id: number) {
  ensureAuth()
  return wrap(api.deleteApiV1ProfilesById(id))
}
