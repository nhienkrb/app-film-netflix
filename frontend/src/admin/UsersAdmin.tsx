import { useEffect, useMemo, useState } from 'react'
import * as uapi from '../features/users'

type RowApi = any
type RowUI = {
  id: number
  display_name?: string
  email?: string
  role?: string
  status?: string
}

/** Chuẩn hoá dữ liệu vì BE đôi khi trả name thay cho display_name */
function normalizeUser(u: RowApi): RowUI {
  return {
    id: u?.id,
    display_name: u?.display_name ?? u?.name ?? '—',
    email: u?.email ?? '—',
    role: u?.role ?? '—',
    status: u?.status ?? '—',
  }
}

const PAGE_SIZES = [10, 20, 50]

export default function UsersAdmin() {
  const [rowsRaw, setRowsRaw] = useState<RowApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Modal
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<RowUI | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const resp = await uapi.listUsers()
      const arr = (resp?.data ?? resp) || []
      setRowsRaw(Array.isArray(arr) ? arr : [])
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Không tải được danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const rows: RowUI[] = useMemo(() => rowsRaw.map(normalizeUser), [rowsRaw])

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return rows
    return rows.filter(r =>
      (r.display_name || '').toLowerCase().includes(k) ||
      (r.email || '').toLowerCase().includes(k) ||
      (r.role || '').toLowerCase().includes(k)
    )
  }, [rows, keyword])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageSafed = Math.min(page, totalPages)
  useEffect(() => { if (page !== pageSafed) setPage(pageSafed) }, [pageSafed])
  const view = useMemo(() => {
    const start = (pageSafed - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, pageSafed, pageSize])

  function onCreate() {
    setEditing(null)
    setOpen(true)
  }
  function onEdit(row: RowUI) {
    setEditing(row)
    setOpen(true)
  }
  async function onDelete(row: RowUI) {
    if (!row.id) return
    if (!confirm(`Xoá người dùng "${row.display_name}"?`)) return
    try {
      await uapi.deleteUser(row.id)
      await load()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(1) }}
            placeholder="Tìm theo tên/email/role…"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            onClick={onCreate}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500"
          >
            Thêm user
          </button>
        </div>
      </div>

      {/* States */}
      {loading && <TableSkeleton />}
      {error && (
        <div className="rounded border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900/70 text-zinc-400">
                <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                  <th className="w-12">#</th>
                  <th>Tên hiển thị</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th className="w-40 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {view.map((r, idx) => (
                  <tr key={r.id ?? idx} className="hover:bg-zinc-900/40">
                    <td className="px-3 py-2 text-zinc-400">{(pageSafed - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2">{r.display_name || '—'}</td>
                    <td className="px-3 py-2">{r.email || '—'}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                        {r.role || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {r.status === 'active' ? (
                        <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs text-green-400">active</span>
                      ) : (
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                          {r.status || '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(r)}
                          className="rounded-lg border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(r)}
                          className="rounded-lg border border-red-700 px-2 py-1 text-red-300 hover:bg-red-900/30"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {view.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-zinc-400">
                      Không có người dùng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pager */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span>Tổng: {total}</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                className="rounded-lg border border-zinc-700 px-3 py-1 hover:bg-zinc-800 disabled:opacity-50"
                disabled={pageSafed <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Trang trước
              </button>
              <span>Trang {pageSafed}/{totalPages}</span>
              <button
                className="rounded-lg border border-zinc-700 px-3 py-1 hover:bg-zinc-800 disabled:opacity-50"
                disabled={pageSafed >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Trang sau
              </button>

              <select
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1"
                value={pageSize}
                onChange={e => { setPage(1); setPageSize(parseInt(e.target.value, 10)) }}
              >
                {PAGE_SIZES.map(n => <option key={n} value={n}>{n}/trang</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      {open && (
        <UserModal
          initial={editing || undefined}
          onClose={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await load() }}
        />
      )}
    </div>
  )
}

/** Modal Tạo/Sửa — chỉ gửi field hợp lệ theo API của bạn */
function UserModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: RowUI
  onClose: () => void
  onSaved: () => void | Promise<void>
}) {
  const isEdit = !!initial
  const [displayName, setDisplayName] = useState(initial?.display_name || '')
  const [email, setEmail] = useState(initial?.email === '—' ? '' : (initial?.email || ''))
  const [password, setPassword] = useState('') // chỉ khi tạo
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit() {
    setSaving(true); setErr(null)
    try {
      if (isEdit && initial?.id) {
        await uapi.updateUser(initial.id, {
          display_name: displayName || undefined,
          email: email || undefined,
        })
      } else {
        if (!displayName || !email || !password) {
          setErr('Vui lòng nhập đầy đủ Tên hiển thị, Email và Mật khẩu'); setSaving(false); return
        }
        await uapi.createUser({ display_name: displayName, email, password })
      }
      await onSaved()
    } catch (e:any) {
      setErr(e?.body?.message || e?.message || 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-1 hover:bg-zinc-800">Đóng</button>
        </div>

        <div className="space-y-3">
          <FormRow label="Tên hiển thị">
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-500"
              placeholder="Nguyen Van A"
            />
          </FormRow>

          <FormRow label="Email">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-500"
              placeholder="name@example.com"
            />
          </FormRow>

          {!isEdit && (
            <FormRow label="Mật khẩu">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-500"
                placeholder="••••••"
              />
            </FormRow>
          )}
        </div>

        {err && <div className="mt-3 rounded border border-red-800 bg-red-950/40 p-2 text-sm text-red-300">{err}</div>}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-800">
            Hủy
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-lg bg-red-600 px-3 py-2 font-medium hover:bg-red-500 disabled:opacity-50"
          >
            {saving ? 'Đang lưu…' : (isEdit ? 'Lưu thay đổi' : 'Tạo mới')}
          </button>
        </div>
      </div>
    </div>
  )
}

function FormRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      {children}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="animate-pulse space-y-2 p-4">
        <div className="h-4 w-1/3 rounded bg-zinc-800" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-zinc-900" />
        ))}
      </div>
    </div>
  )
}
