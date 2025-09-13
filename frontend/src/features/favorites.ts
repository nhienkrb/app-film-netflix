// src/features/favorites.ts
import api from '../api'               // default aggregator đã expose từ skeleton
import { getSession } from '../lib/auth'  // dùng để kiểm tra token trước khi gọi

export type FavoritePair = { userId: number; movieId: number }

export type FavoriteCheckResp = { success: boolean; isFavorite: boolean }
export type FavoriteListResp = { success: boolean; data: any[] }
export type FavoriteAddResp = { success: boolean; data: { user_id: number; movie_id: number } }
export type FavoriteRemoveResp = { success: boolean; message: string }

/** Đảm bảo đã đăng nhập (có JWT), nếu thiếu thì throw sớm để dev thấy rõ */
function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

/** GET: danh sách yêu thích của 1 user */
export async function getFavoritesByUser(userId: number): Promise<FavoriteListResp> {
  ensureAuth()
  return api.getApiV1FavoritesUserByUserid(userId)
}

/** GET: kiểm tra 1 cặp (userId, movieId) có thuộc favorites không */
export async function checkFavorite(pair: FavoritePair): Promise<FavoriteCheckResp> {
  ensureAuth()
  // hàm đã sinh: getApiV1FavoritesCheck(undefined, query?)
  return api.getApiV1FavoritesCheck({ userId: pair.userId, movieId: pair.movieId });
}

/** POST: thêm vào favorites — body: { userId, movieId } */
export async function addFavorite(pair: FavoritePair): Promise<FavoriteAddResp> {
  ensureAuth()
  return api.postApiV1Favorites({ userId: pair.userId, movieId: pair.movieId })
}

/** DELETE: xoá khỏi favorites — body: { userId, movieId } */
export async function removeFavorite(pair: FavoritePair): Promise<FavoriteRemoveResp> {
  ensureAuth()
  // Lưu ý: endpoint DELETE này nhận body JSON (đúng theo curl bạn gửi)
  return api.deleteApiV1Favorites({ userId: pair.userId, movieId: pair.movieId })
}
