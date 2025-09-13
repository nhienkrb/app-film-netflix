// src/pages/Favorites.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { getSession } from '../lib/auth'
import { Heart } from 'lucide-react'

type FavoriteRow = {
  id?: number          // một số BE trả id = movieId
  movie_id?: number
  // optional thin fields
  title?: string
  poster_url?: string
  link_ytb?: string | null
}

type MovieDetail = {
  id: number
  title?: string
  poster_url?: string
  link_ytb?: string | null
  release_year?: number
  duration_min?: number
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

export default function Favorites() {
  const navigate = useNavigate()
  const { token, isAuthenticated, payload } = getSession()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  const userId = payload?.id as number | undefined
  const authToken = token || undefined

  const [items, setItems] = useState<MovieDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // paging (client-side)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const totalPages = Math.max(1, Math.ceil(items.length / limit))
  const pageSafe = Math.min(Math.max(1, page), totalPages)
  const slice = useMemo(() => {
    const off = (pageSafe - 1) * limit
    return items.slice(off, off + limit)
  }, [items, pageSafe, limit])

  async function load() {
    if (!userId) return
    setLoading(true); setError(null)
    try {
      // 1) lấy danh sách favorites (mỏng)
      const resp = await api.getApiV1FavoritesUserByUserid(userId, undefined, authToken)
      const rows: FavoriteRow[] = (resp?.data ?? resp) || []
      const ids = rows
        .map(r => r.id ?? r.movie_id)
        .filter((x): x is number => typeof x === 'number')

      // 2) fetch chi tiết từng movie (song song)
      const details = await Promise.all(
        ids.map(id =>
          api.getApiV1MoviesById(id, undefined, authToken)
            .then(res => (res?.data ?? res) as MovieDetail)
            .catch(() => null)
        )
      )

      // 3) normalize + fallback poster nếu thiếu (lấy từ YouTube)
      const enriched: MovieDetail[] = details
        .map((d, idx) => {
          const thin = rows[idx]
          if (!d) {
            const mid = ids[idx]
            const ythumb = youtubeThumb(thin?.link_ytb)
            return { id: mid, title: thin?.title || `#${mid}`, poster_url: ythumb || '/placeholder.png', link_ytb: thin?.link_ytb ?? null }
          }
          const poster = d.poster_url || youtubeThumb(d.link_ytb) || '/placeholder.png'
          return { ...d, poster_url: poster }
        })
        .filter(Boolean) as MovieDetail[]

      setItems(enriched)
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) {
        navigate('/login', { replace: true }); return
      }
      setError(e?.body?.message || e?.message || 'Không tải được danh sách yêu thích')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // load 1 lần

  // Thêm/Bỏ yêu thích (optimistic)
  async function toggleFavorite(m: MovieDetail) {
    if (!userId) return
    const isFav = items.some(x => x.id === m.id)
    try {
      setItems(cur => cur.filter(x => x.id !== m.id)) // optimistic remove
      if (isFav) {
        await api.deleteApiV1Favorites({ userId, movieId: m.id }, undefined, authToken)
      } else {
        await api.postApiV1Favorites({ userId, movieId: m.id }, undefined, authToken)
        await load()
      }
    } catch (e: any) {
      // rollback
      await load()
      if (e?.status === 401 || e?.status === 403) {
        navigate('/login', { replace: true }); return
      }
      alert(e?.body?.message || 'Lỗi khi cập nhật yêu thích')
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Yêu thích</h1>
          <p className="text-zinc-400">Các phim đã đánh dấu <span className="align-middle">❤️</span></p>
        </div>
        <div className="text-sm text-zinc-400">Trang {pageSafe} • {items.length} mục</div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-lg bg-zinc-800" />
          ))}
        </div>
      )}

      {error && <div className="p-6 text-red-400">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-400">Chưa có phim nào.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {slice.map(m => (
              <div key={m.id} className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                <Link to={`/movie/${m.id}`} title={m.title}>
                  <div className="w-full aspect-[2/3] bg-zinc-800">
                    <img
                      src={m.poster_url || '/placeholder.png'}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(m)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-red-600"
                  title="Bỏ yêu thích"
                  aria-label="Bỏ yêu thích"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-sm">
                  <div className="line-clamp-2 font-medium">{m.title || `#${m.id}`}</div>
                  <div className="text-xs text-zinc-400">
                    {m.release_year ?? '—'} • {m.duration_min ? `${m.duration_min}'` : '—'}
                  </div>
                </div>
              </div>
            ))}
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
              {[10, 12, 18, 24].map(l => <option key={l} value={l}>{l}/trang</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  )
}
