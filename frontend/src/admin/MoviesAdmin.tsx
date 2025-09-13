import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as movies from '../features/movies'
import { getSession } from '../lib/auth'
import MovieFormModal from './components/MovieFormModal'

type Row = movies.Movie

const PAGE_SIZE = 10

export default function MoviesAdmin() {
  const nav = useNavigate()
  const { isAuthenticated, role } = getSession()

  useEffect(() => {
    if (!isAuthenticated) nav('/login', { replace: true })
    else if (role !== 'admin') nav('/403', { replace: true })
  }, [isAuthenticated, role, nav])

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Genres
  const [genres, setGenres] = useState<movies.Genre[]>([])
  const genreMap = useMemo(() => {
    const m = new Map<number, string>()
    for (const g of genres) m.set(g.id, g.name)
    return m
  }, [genres])

  // search + paging (client)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return rows
    return rows.filter(r =>
      r.title?.toLowerCase().includes(k) ||
      String(r.release_year ?? '').includes(k)
    )
  }, [rows, keyword])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function load() {
    setLoading(true); setError(null)
    try {
      // movies list
      const data = await movies.listAll()
      const arr: Row[] = (data as any)?.data ?? (data as any) ?? []
      setRows(arr)

      // genres
      const gs = await movies.listGenres()
      setGenres(gs)
    } catch (e: any) {
      setError(e?.body?.message || 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // modal
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Row | null>(null)

  function openCreate() { setEdit(null); setOpen(true) }
  function openEdit(r: Row) { setEdit(r); setOpen(true) }
  function closeModal() { setOpen(false) }

  async function handleDelete(id: number) {
    if (!confirm('Xoá phim này?')) return
    try {
      await movies.remove(id)
      await load()
    } catch (e: any) {
      alert(e?.body?.message || 'Xoá thất bại')
    }
  }

  // Map genres hiển thị
  function renderGenresCell(r: any) {
    // 1) Nếu BE trả sẵn mảng tên
    if (Array.isArray(r.genres) && r.genres.every((x: any) => typeof x === 'string')) {
      return r.genres.join(', ')
    }
    // 2) Nếu có mảng id
    if (Array.isArray(r.genres) && r.genres.every((x: any) => typeof x === 'number')) {
      return r.genres.map((id: number) => genreMap.get(id) ?? `#${id}`).join(', ') || '—'
    }
    if (Array.isArray(r.genre_ids)) {
      return r.genre_ids.map((id: number) => genreMap.get(id) ?? `#${id}`).join(', ') || '—'
    }
    // 3) Nếu chỉ có 1 id
    if (typeof r.genre_id === 'number') {
      return genreMap.get(r.genre_id) ?? `#${r.genre_id}`
    }
    // fallback
    return '—'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Movies</h1>
        <div className="ml-auto flex gap-2">
          <input
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm min-w-[220px]"
            placeholder="Tìm theo tiêu đề…"
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(1) }}
          />
          <button
            className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-500"
            onClick={openCreate}
          >
            Thêm phim
          </button>
        </div>
      </div>

      {loading && <div className="p-4 text-sm text-zinc-400">Đang tải…</div>}
      {error && <div className="p-4 text-sm text-red-400">{error}</div>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Tiêu đề</th>
                  <th className="px-3 py-2">Năm</th>
                  <th className="px-3 py-2">Thời lượng</th>
                  <th className="px-3 py-2 text-left">Thể loại</th>
                  <th className="px-3 py-2">Điểm TB</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, idx) => (
                  <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                    <td className="px-3 py-2">{(page-1)*PAGE_SIZE + idx + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.poster_url || '/placeholder.png'}
                          className="h-10 w-7 rounded object-cover"
                          alt=""
                        />
                        <div className="font-medium">{r.title}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">{r.release_year ?? '—'}</td>
                    <td className="px-3 py-2 text-center">{r.duration_min ? `${r.duration_min}'` : '—'}</td>
                    <td className="px-3 py-2">{renderGenresCell(r)}</td>
                    <td className="px-3 py-2 text-center">{r.avg_rating ?? '—'}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                          onClick={() => openEdit(r)}
                        >Sửa</button>
                        <button
                          className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                          onClick={() => handleDelete(r.id)}
                        >Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-zinc-400">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3">
            <button
              className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
            >Trang trước</button>
            <span className="text-sm text-zinc-400">Trang {page}/{totalPages}</span>
            <button
              className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
            >Trang sau</button>
          </div>
        </>
      )}

      {/* Modal create/edit */}
      {open && (
        <MovieFormModal
          movie={edit ?? undefined}
          onClose={closeModal}
          onSuccess={async () => { closeModal(); await load() }}
        />
      )}
    </div>
  )
}
