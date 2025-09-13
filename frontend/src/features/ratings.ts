// src/features/ratings.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type Rating = {
  id: number
  movie_id: number
  user_id: number
  stars: number
  comment?: string | null
  createdAt?: string
}

export type RatingsListResp = { err?: number; message?: string; data?: Rating[] } | any
export type RatingWriteReq = { movie_id: number; stars: number; comment?: string | null }

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

/** Lấy toàn bộ rating của 1 phim (public theo cURL) */
export async function listByMovie(movieId: number): Promise<RatingsListResp> {
  return api.getApiV1RatingsByMovieid(movieId)
}

/** Tạo mới rating (JWT). BE sẽ suy ra user từ JWT. */
export async function createRating(body: RatingWriteReq) {
  ensureAuth()
  return api.postApiV1Ratings(body)
}

/** Cập nhật rating của chính user cho phim (JWT) */
export async function updateRating(body: RatingWriteReq) {
  ensureAuth()
  return api.putApiV1Ratings(body)
}

/** Xoá rating của chính user cho phim (JWT) */
export async function deleteRating(movie_id: number) {
  ensureAuth()
  return api.deleteApiV1Ratings({ movie_id })
}




