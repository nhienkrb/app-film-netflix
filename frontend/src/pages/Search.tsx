// src/pages/Search.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'

type Movie = {
  id: number
  title: string
  poster_url?: string
  release_year?: number
  duration_min?: number
}

type Genre = { id: number; name: string }

const PAGE_SIZE = 18
const DEBOUNCE_MS = 350

export default function Search() {
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()

  // URL state
  const qInit = sp.get('q') ?? ''
  const gInit = sp.get('genre') ?? ''
  const pInit = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1)

  const [q, setQ] = useState(qInit)
  const [genre, setGenre] = useState(gInit)
  const [page, setPage] = useState<number>(pInit)

  // data
  const [genres, setGenres] = useState<Genre[]>([])
  const [items, setItems] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // sync URL whenever q/genre/page thay đổi
  useEffect(() => {
    const params: Record<string,string> = {}
    if (q.trim()) params.q = q.trim()
    if (genre) params.genre = genre
    if (page > 1) params.page = String(page)
    setSp(params, { replace: true })
  }, [q, genre, page, setSp])

  // tải genres
  useEffect(() => {
    api.getApiV1Genres()
      .then(res => setGenres((res?.data ?? res) || []))
      .catch(() => setGenres([]))
  }, [])

  // debounce keyword
  const [qDebounced, setQDebounced] = useState(q)
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [q])

  // thực thi search mỗi khi qDebounced/genre đổi
  useEffect(() => {
    let aborted = false
    async function run() {
      setLoading(true); setError(null)
      try {
        let result: Movie[] = []
        const hasQ = !!qDebounced.trim()
        const hasGenre = !!genre

        if (!hasQ && !hasGenre) {
          // Mặc định: trả list tất cả cho người dùng duyệt
          const res = await api.getApiV1Movies()
          result = (res?.data ?? res) || []
        } else if (hasQ && !hasGenre) {
          const res = await api.getApiV1MoviesSearchByKeyword(qDebounced.trim())
          result = (res?.data ?? res) || []
        } else if (!hasQ && hasGenre) {
          const res = await api.getApiV1MoviesByGenre(genre)
          result = (res?.data ?? res) || []
        } else {
          // cả keyword + genre: lấy theo genre rồi lọc theo keyword ở FE
          const res = await api.getApiV1MoviesByGenre(genre)
          const arr: Movie[] = (res?.data ?? res) || []
          const k = qDebounced.trim().toLowerCase()
          result = arr.filter(m =>
            (m.title || '').toLowerCase().includes(k)
            || String(m.release_year ?? '').includes(k)
          )
        }

        if (!aborted) {
          setItems(result)
          setPage(1) // mỗi lần filter đổi → về trang 1
        }
      } catch (e: any) {
        if (!aborted) setError(e?.body?.message || e?.message || 'Không tìm được kết quả')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    run()
    return () => { aborted = true }
  }, [qDebounced, genre])

  // phân trang client
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pageSafe = Math.min(Math.max(1, page), totalPages)
  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, pageSafe])

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-zinc-400">Từ khóa</label>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Nhập tiêu đề, năm…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
          />
        </div>

        <div className="w-full sm:w-72">
          <label className="mb-1 block text-sm text-zinc-400">Thể loại</label>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
          >
            <option value="">-- Tất cả thể loại --</option>
            {genres.map(g => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-800"
            onClick={() => { setQ(''); setGenre(''); setPage(1) }}
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {/* trạng thái */}
      {loading && <div className="py-6 text-zinc-400">Đang tìm…</div>}
      {error && <div className="py-6 text-red-400">{error}</div>}

      {!loading && !error && (
        <>
          <div className="mb-3 text-sm text-zinc-400">
            {items.length} kết quả {qDebounced || genre ? 'được tìm thấy' : '(hiển thị tất cả)'}
          </div>

          {paged.length === 0 ? (
            <div className="py-8 text-zinc-400">Không có phim phù hợp.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {paged.map(m => (
                <Link
                  key={m.id}
                  to={`/movie/${m.id}`}
                  className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="w-full aspect-[2/3] bg-zinc-800">
                    <img
                      src={m.poster_url || '/placeholder.png'}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <div className="line-clamp-2 text-sm font-medium">{m.title}</div>
                    <div className="text-xs text-zinc-400">
                      {m.release_year ?? '—'} • {m.duration_min ? `${m.duration_min}'` : '—'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
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
          </div>
        </>
      )}
    </div>
  )
}
