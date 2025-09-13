// src/features/viewHistory.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type ViewHistoryItem = {
  id?: number
  movie_id?: number
  position_sec?: number
  created_at?: string
  updated_at?: string
  movie?: any
}

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

/** Lấy toàn bộ lịch sử xem của user hiện tại (theo JWT) */
export async function listMyHistory() {
  ensureAuth()
  return api.getApiV1ViewHistory()
}

/** Tạo/Cập nhật vị trí xem cho 1 movie (upsert theo BE) */
export async function upsertPosition(movieId: number, position_sec: number) {
  ensureAuth()
  return api.postApiV1ViewHistory({ movieId, position_sec })
}

/** Xoá lịch sử xem của 1 movie */
export async function removeByMovie(movieId: number) {
  ensureAuth()
  return api.deleteApiV1ViewHistoryByMovieid(movieId)
}
