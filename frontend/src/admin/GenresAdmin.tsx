// src/admin/GenresAdmin.tsx
import { useEffect, useMemo, useState } from 'react'
import * as genres from '../features/genres'
import { getSession } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

type Genre = genres.Genre

export default function GenresAdmin() {
  const nav = useNavigate()
  const { isAuthenticated } = getSession()

  const [items, setItems] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // search (client-side)
  const [q, setQ] = useState('')

  // modal state
  const [open, setOpen] = useState<false | { mode: 'create' } | { mode: 'edit'; data: Genre }>(false)
  const [form, setForm] = useState<{ name: string }>({ name: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) nav('/login', { replace: true })
  }, [isAuthenticated, nav])

  async function load() {
    setLoading(true); setError(null)
    try {
      const r = await genres.listGenres()
      const arr: Genre[] = (r?.data ?? r) || []
      setItems(Array.isArray(arr) ? arr : [])
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) return nav('/login', { replace: true })
      setError(e?.body?.message || 'Không tải được thể loại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const view = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter(it => it.name.toLowerCase().includes(s))
  }, [items, q])

  function openCreate() {
    setForm({ name: '' })
    setOpen({ mode: 'create' })
  }
  function openEdit(it: Genre) {
    setForm({ name: it.name })
    setOpen({ mode: 'edit', data: it })
  }
  function closeModal() { setOpen(false) }

  async function submit() {
    if (!form.name.trim()) return alert('Vui lòng nhập tên thể loại')
    setBusy(true)
    try {
      if (open && 'mode' in open && open.mode === 'edit') {
        await genres.updateGenre(open.data.id, { name: form.name.trim() })
      } else {
        await genres.createGenre({ name: form.name.trim() })
      }
      closeModal()
      await load()
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) return nav('/login', { replace: true })
      alert(e?.body?.message || 'Không thể lưu')
    } finally {
      setBusy(false)
    }
  }

  async function remove(it: Genre) {
    if (!confirm(`Xoá thể loại "${it.name}"?`)) return
    try {
      await genres.deleteGenre(it.id)
      await load()
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) return nav('/login', { replace: true })
      alert(e?.body?.message || 'Không thể xoá')
    }
  }

  if (!isAuthenticated) return null
  if (loading) return <div className="p-6">Đang tải…</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Genres</h1>
          <p className="text-sm text-zinc-400">Quản lý thể loại phim</p>
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm theo tên…"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            onClick={openCreate}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500"
          >
            Thêm thể loại
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-950">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-4 py-3 w-16">#</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3 w-48 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {view.map((it, idx) => (
              <tr key={it.id} className="text-sm hover:bg-zinc-900/40">
                <td className="px-4 py-3 text-zinc-400">{idx + 1}</td>
                <td className="px-4 py-3 font-medium">{it.name}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(it)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => remove(it)}
                      className="rounded-lg border border-red-700 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/30"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-zinc-400">
                  Không có mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal create/edit */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {open.mode === 'edit' ? 'Sửa thể loại' : 'Thêm thể loại'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg border border-zinc-700 px-2 py-1 text-sm hover:bg-zinc-800"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block text-zinc-400">Tên</span>
                <input
                  value={form.name}
                  onChange={e => setForm({ name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-500"
                  placeholder="Ví dụ: Action"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={submit}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500 disabled:opacity-60"
              >
                {busy ? 'Đang lưu…' : (open.mode === 'edit' ? 'Cập nhật' : 'Tạo')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
