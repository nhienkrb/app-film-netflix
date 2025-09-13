// src/pages/History.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession } from '../lib/auth'
import api from '../api' // aggregator đã export getApiV1ViewHistory, deleteApiV1ViewHistoryByMovieid, getApiV1MoviesById

type HistoryRow = {
  id?: number
  movieId?: number       // FE camel
  movie_id?: number      // BE snake
  position_sec?: number  // giây đã xem
  duration_min?: number  // *nếu BE trả kèm*, không thì lấy từ movie detail
  movie?: {
    id?: number
    title?: string
    poster_url?: string
    link_ytb?: string | null
    duration_min?: number
  }
}

type MovieDetail = {
  id: number
  title?: string
  poster_url?: string
  link_ytb?: string | null
  duration_min?: number
  release_year?: number
}

const DEFAULT_LIMIT = 12

function youtubeThumb(url?: string | null) {
  if (!url) return ''
  try {
    const u = new URL(url)
    const id = u.searchParams.get('v') || u.pathname.split('/').pop() || ''
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
  } catch { return '' }
}
function midOf(h: HistoryRow): number | undefined {
  return h.movieId ?? h.movie_id ?? h.movie?.id
}

export default function History() {
  const navigate = useNavigate()
  const { isAuthenticated, token } = getSession()
  const authToken = token || undefined

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  const [items, setItems] = useState<(HistoryRow & { _movie: MovieDetail })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // paging (client-side vì list lịch sử thường không quá lớn, đồng nhất UI)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const totalPages = Math.max(1, Math.ceil(items.length / limit))
  const pageSafe = Math.min(Math.max(1, page), totalPages)
  const paged = useMemo(() => {
    const off = (pageSafe - 1) * limit
    return items.slice(off, off + limit)
  }, [items, pageSafe, limit])

  async function load() {
    setLoading(true); setError(null)
    try {
      // 1) lấy lịch sử (mỏng)
      const resp = await api.getApiV1ViewHistory(undefined, authToken)
      const raw: HistoryRow[] = (resp?.data ?? resp) || []

      // 2) enrich movie details song song
      const details = await Promise.all(
        raw.map(async (row) => {
          const id = midOf(row)
          if (!id) return null
          try {
            const d = await api.getApiV1MoviesById(id, undefined, authToken)
            const mv = (d?.data ?? d) as MovieDetail
            const poster = mv.poster_url || youtubeThumb(mv.link_ytb) || '/placeholder.png'
            return { ...row, _movie: { ...mv, poster_url: poster } }
          } catch {
            // fallback khi getById fail: dựng từ row.movie
            const thin = row.movie || {}
            const poster = thin.poster_url || youtubeThumb(thin.link_ytb) || '/placeholder.png'
            return { ...row, _movie: { id, title: thin.title || `#${id}`, poster_url: poster, link_ytb: thin.link_ytb ?? null, duration_min: thin.duration_min } }
          }
        })
      )

      setItems(details.filter(Boolean) as (HistoryRow & { _movie: MovieDetail })[])
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) {
        navigate('/login', { replace: true }); return
      }
      setError(e?.body?.message || e?.message || 'Không tải được lịch sử xem')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // chỉ load 1 lần; phân trang ở client

  async function removeOne(movieId?: number) {
    if (!movieId) return
    // optimistic
    setItems(list => list.filter(x => x._movie.id !== movieId))
    try {
      await api.deleteApiV1ViewHistoryByMovieid(movieId, undefined, undefined, authToken)
    } catch {
      // rollback
      await load()
    }
  }

  async function clearAll() {
    const ids = items.map(x => x._movie.id)
    // optimistic
    setItems([])
    try {
      await Promise.all(ids.map(id => api.deleteApiV1ViewHistoryByMovieid(id, undefined, undefined, authToken)))
    } catch {
      // rollback
      await load()
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lịch sử xem</h1>
          <p className="text-zinc-400">Tiếp tục xem dở, quản lý lịch sử phát</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="rounded bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700"
          >
            Xoá tất cả
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-lg bg-zinc-800" />
          ))}
        </div>
      )}

      {error && <div className="p-6 text-red-400">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-400">Chưa có lịch sử xem.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {paged.map((it) => {
              const mid = it._movie.id
              const title = it._movie.title || `#${mid}`
              const poster = it._movie.poster_url || '/placeholder.png'
              const durationSec = (it.movie?.duration_min ?? it._movie.duration_min ?? 0) * 60
              const pos = Math.max(0, Math.min(it.position_sec ?? 0, durationSec || 1))
              const pct = durationSec ? Math.min(100, Math.round((pos / durationSec) * 100)) : 0

              return (
                <div key={`${mid}-${it.id ?? ''}`} className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                  <Link to={`/movie/${mid}`} title={title}>
                    <div className="w-full aspect-[2/3] bg-zinc-800">
                      <img
                        src={poster}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Progress bar */}
                  <div className="absolute left-0 right-0 bottom-8 h-1 bg-black/40">
                    <div className="h-full bg-red-500" style={{ width: `${pct}%` }} />
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-sm">
                    <div className="line-clamp-2 font-medium">{title}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                      <span>{pct ? `${pct}%` : 'Chưa bắt đầu'}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/watch/${mid}?t=${pos || 0}`}
                          className="rounded bg-red-600 px-2 py-0.5 text-white hover:bg-red-500"
                        >
                          Tiếp tục
                        </Link>
                        <button
                          onClick={() => removeOne(mid)}
                          className="rounded bg-black/60 px-2 py-0.5 text-white hover:bg-red-600"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pager */}
          <div className="mt-6 flex items-center gap-3">
            <button
              className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 disabled:opacity-50"
              disabled={pageSafe <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >Trang trước</button>

            <span className="text-sm text-zinc-400">Trang {pageSafe}/{totalPages}</span>

            <button
              className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 disabled:opacity-50"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >Trang sau</button>

            <select
              className="ml-auto rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm"
              value={limit}
              onChange={e => { setPage(1); setLimit(parseInt(e.target.value, 10)) }}
            >
              {[12, 18, 24].map(l => <option key={l} value={l}>{l}/trang</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  )
}
