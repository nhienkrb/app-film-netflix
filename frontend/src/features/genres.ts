// src/features/genres.ts
// Mục tiêu: wrap các hàm client đã sinh trong src/api/api_resource.ts
// để gọi đúng payload & header (JWT), và cung cấp chữ ký dễ dùng.

import api from '../api'
import { getSession } from '../lib/auth'

export type Genre = { id: number; name: string }
export type GenresListResp   = { success?: boolean; data?: Genre[] } | Genre[] | any
export type GenreOneResp     = { success?: boolean; data?: Genre } | any
export type GenreCreateReq   = { name: string }
export type GenreUpdateReq   = { name: string }
export type GenreCreateResp  = { success: true; message: string; data: Genre } | any
export type GenreUpdateResp  = { success: true; message: string; data: Genre } | any
export type GenreDeleteResp  = { message: string } | any

/** Chặn gọi khi chưa có token (FE kiểm tra exp; verify chữ ký là việc của BE) */
function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

/** GET /api/v1/genres  (yêu cầu JWT) */
export async function listGenres(): Promise<GenresListResp> {
  ensureAuth()
  // client đã fix: getApiV1Genres(query?, token?)
  return api.getApiV1Genres()
}

/** GET /api/v1/genres/:id  (yêu cầu JWT) */
export async function getGenre(id: number): Promise<GenreOneResp> {
  ensureAuth()
  return api.getApiV1GenresById(id)
}

/** POST /api/v1/genres  body: { name } (yêu cầu JWT) */
export async function createGenre(body: GenreCreateReq): Promise<GenreCreateResp> {
  ensureAuth()
  return api.postApiV1Genres(body)
}

/** PUT /api/v1/genres/:id  body: { name } (yêu cầu JWT) */
export async function updateGenre(id: number, body: GenreUpdateReq): Promise<GenreUpdateResp> {
  ensureAuth()
  return api.putApiV1GenresById(id, body)
}

/** DELETE /api/v1/genres/:id  (yêu cầu JWT) */
export async function deleteGenre(id: number): Promise<GenreDeleteResp> {
  ensureAuth()
  // server không cần body cho DELETE id; truyền undefined
  return api.deleteApiV1GenresById(id, undefined)
}
