// src/features/users.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type UserLite = { id: number; name?: string }
export type UserDetail = {
  id: number
  display_name?: string
  email?: string
  role?: 'viewer' | 'admin' | string
  status?: 'active' | 'inactive' | string
  createdAt?: string
  updatedAt?: string
}

export type CreateUserReq = {
  display_name: string
  email: string
  password: string
}
export type UpdateUserReq = Partial<Pick<CreateUserReq, 'display_name' | 'email'>> & {
  // thêm field khác nếu BE cho phép (role/status…)
}

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

export async function getMe() {
  ensureAuth()
  return api.getApiV1User()
}

export async function listUsers() {
  ensureAuth()
  return api.getApiV1UserAll()
}

export async function createUser(body: CreateUserReq) {
  ensureAuth()
  return api.postApiV1User(body)
}

export async function updateUser(id: number, body: UpdateUserReq) {
  ensureAuth()
  return api.putApiV1UserById(id, body)
}

export async function deleteUser(id: number) {
  ensureAuth()
  return api.deleteApiV1UserById(id)
}
