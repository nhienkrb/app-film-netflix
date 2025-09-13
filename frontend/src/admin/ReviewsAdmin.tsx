import React from 'react'
import { getSession } from '../lib/auth'
import * as ratings from '../features/ratings'
import * as movies from '../features/movies'

type Row = ratings.Rating
type Movie = movies.Movie

function StarInput({
  value,
  onChange,
  max = 5,
}: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1
        const active = n <= value
        return (
          <button
            key={n}
            type="button"
            className={`h-6 w-6 rounded text-lg leading-6 ${
              active ? 'text-yellow-400' : 'text-zinc-500'
            }`}
            onClick={() => onChange(n)}
            aria-label={`${n} sao`}
            title={`${n} sao`}
          >
            ★
          </button>
        )
      })}
      <span className="ml-2 text-sm text-zinc-400">{value} / 5</span>
    </div>
  )
}

export default function ReviewsAdmin() {
  const { isAuthenticated, payload } = getSession()
  const myUserId = Number(payload?.id || 0)

  const [moviesAll, setMoviesAll] = React.useState<Movie[]>([])
  const [movieId, setMovieId] = React.useState<number | ''>('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [rows, setRows] = React.useState<Row[]>([])

  // modal state
  const [editing, setEditing] = React.useState<Row | null>(null)
  const [stars, setStars] = React.useState<number>(3)
  const [comment, setComment] = React.useState<string>('')

  React.useEffect(() => {
    // tải danh sách phim (public)
    movies
      .listAll()
      .then((r: any) => {
        const arr: Movie[] = r?.data ?? r ?? []
        setMoviesAll(Array.isArray(arr) ? arr : [])
      })
      .catch(() => {})
  }, [])

  async function reload() {
    if (!movieId) return
    setLoading(true)
    setError(null)
    try {
      const r = await ratings.listByMovie(Number(movieId))
      const arr: Row[] = r?.data ?? r ?? []
      setRows(Array.isArray(arr) ? arr : [])
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Không tải được danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (movieId) reload()
  }, [movieId]) // eslint-disable-line

  // Chỉ cho phép sửa/xóa review của CHÍNH MÌNH (theo API hiện có)
  function canEdit(row: Row) {
    return isAuthenticated && myUserId && Number(row.user_id) === myUserId
  }

  function openEdit(row: Row) {
    if (!canEdit(row)) return
    setEditing(row)
    setStars(row.stars)
    setComment(row.comment || '')
  }

  async function saveEdit() {
    if (!editing) return
    try {
      await ratings.updateRating({
        movie_id: editing.movie_id,
        stars,
        comment: comment || null,
      })
      setEditing(null)
      await reload()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Cập nhật đánh giá thất bại')
    }
  }

  async function removeMine(row: Row) {
    if (!canEdit(row)) return
    if (!confirm('Xóa đánh giá của bạn cho phim này?')) return
    try {
      await ratings.deleteRating(row.movie_id)
      await reload()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Xóa đánh giá thất bại')
    }
  }

  function datefmt(s?: string) {
    if (!s) return '—'
    try {
      return new Date(s).toLocaleString('vi-VN')
    } catch {
      return s
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Reviews</h1>

        <select
          className="ml-auto rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">— Chọn phim để xem đánh giá —</option>
          {moviesAll.map((m) => (
            <option key={m.id} value={m.id}>
              #{m.id} — {m.title}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          onClick={reload}
          disabled={!movieId || loading}
        >
          Tải lại
        </button>
      </div>

      {!movieId && (
        <div className="rounded border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          Hãy chọn một phim để xem danh sách đánh giá.
        </div>
      )}

      {movieId && (
        <>
          {loading && <div className="p-4 text-sm text-zinc-400">Đang tải…</div>}
          {error && <div className="p-4 text-sm text-red-400">{error}</div>}

          {!loading && !error && (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">User ID</th>
                    <th className="px-3 py-2 text-left">Điểm</th>
                    <th className="px-3 py-2 text-left">Nội dung</th>
                    <th className="px-3 py-2 text-left">Tạo lúc</th>
                    <th className="px-3 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-zinc-500">
                        Chưa có đánh giá.
                      </td>
                    </tr>
                  )}
                  {rows.map((r, idx) => (
                    <tr key={r.id ?? `${r.user_id}-${idx}`} className="odd:bg-zinc-950 even:bg-zinc-900/30">
                      <td className="px-3 py-2">#{r.id || idx + 1}</td>
                      <td className="px-3 py-2">{r.user_id}</td>
                      <td className="px-3 py-2">
                        <span className="font-medium">{r.stars}</span> / 5
                      </td>
                      <td className="px-3 py-2 max-w-[520px]">
                        <div className="truncate" title={r.comment || ''}>
                          {r.comment || '—'}
                        </div>
                      </td>
                      <td className="px-3 py-2">{datefmt(r.createdAt)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            className={`rounded border px-2 py-1 text-xs ${
                              canEdit(r)
                                ? 'border-zinc-700 hover:bg-zinc-800'
                                : 'border-zinc-800 text-zinc-500'
                            }`}
                            disabled={!canEdit(r)}
                            onClick={() => openEdit(r)}
                          >
                            Sửa (của tôi)
                          </button>
                          <button
                            className={`rounded border px-2 py-1 text-xs ${
                              canEdit(r)
                                ? 'border-red-700 text-red-300 hover:bg-red-900/20'
                                : 'border-zinc-800 text-zinc-500'
                            }`}
                            disabled={!canEdit(r)}
                            onClick={() => removeMine(r)}
                          >
                            Xoá (của tôi)
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sửa đánh giá của bạn</h3>
              <button
                className="rounded-lg border border-zinc-700 px-2 py-1 text-sm hover:bg-zinc-800"
                onClick={() => setEditing(null)}
              >
                Đóng
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1 text-sm text-zinc-400">Điểm</div>
                <StarInput value={stars} onChange={setStars} />
              </div>

              <div>
                <div className="mb-1 text-sm text-zinc-400">Nội dung (tuỳ chọn)</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none ring-0"
                  placeholder="Chia sẻ cảm nhận của bạn…"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                  onClick={() => setEditing(null)}
                >
                  Hủy
                </button>
                <button
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                  onClick={saveEdit}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
