import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../lib/auth'
import * as subs from '../features/subscriptions'
import * as plans from '../features/plans'

type Subscription = subs.Subscription
type Plan = plans.Plan

function fmtDate(s?: string) {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(d.getTime()) ? s! : d.toLocaleDateString('vi-VN')
}
function fmtVND(v?: number | string) {
  if (v === undefined) return '—'
  const n = typeof v === 'string' ? Number(v) : v
  return isNaN(n) ? String(v) : new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function SubscriptionsAdmin() {
  const { isAuthenticated } = getSession()
  const nav = useNavigate()

  const [items, setItems] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [q, setQ] = useState('')
  const [userId, setUserId] = useState<string>('')
  const [planId, setPlanId] = useState<string>('')

  // modal state
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const r = await subs.listSubscriptions()
      setItems((r?.data ?? r) || [])
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) return nav('/login', { replace: true })
      setError(e?.body?.message || e?.message || 'Không tải được subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) nav('/login', { replace: true })
    else load()
  }, []) // eslint-disable-line

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    const uid = userId.trim()
    const pid = planId.trim()
    return items.filter(s => {
      if (uid && String(s.user_id) !== uid) return false
      if (pid && String(s.plan_id) !== pid) return false
      if (!k) return true
      const hay = [
        s.user?.email, s.user?.display_name,
        s.plan?.name, s.status, String(s.id),
      ].join(' ').toLowerCase()
      return hay.includes(k)
    })
  }, [items, q, userId, planId])

  async function remove(id: number) {
    if (!confirm('Xoá đăng ký này?')) return
    try {
      await subs.deleteSubscription(id)
      await load()
    } catch (e: any) {
      alert(e?.body?.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="p-6">
      {/* header + filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm email / plan / trạng thái…"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
          <input
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            placeholder="Plan ID"
            className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
          <button
            onClick={() => { setQ(''); setUserId(''); setPlanId('') }}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          >
            Xoá lọc
          </button>
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Tạo đăng ký
          </button>
        </div>
      </div>

      {loading && <div className="rounded border border-zinc-800 bg-zinc-900 p-4">Đang tải…</div>}
      {error && <div className="rounded border border-zinc-800 bg-red-950/30 p-4 text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950/50 text-zinc-400">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Người dùng</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Gói</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Trạng thái</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Kỳ hiện tại</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Giá</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-2 text-sm text-zinc-400">{i + 1}</td>
                  <td className="px-4 py-2 text-sm text-zinc-400">#{s.id}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="font-medium text-white">{s.user?.display_name || '—'}</div>
                    <div className="text-xs text-zinc-400">{s.user?.email}</div>
                    <div className="text-xs text-zinc-500">UID: {s.user_id}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="font-medium text-white">{s.plan?.name || `#${s.plan_id}`}</div>
                    <div className="text-xs text-zinc-500">PID: {s.plan_id}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      s.status === 'active' ? 'bg-green-900/30 text-green-400'
                        : s.status === 'expired' ? 'bg-amber-900/30 text-amber-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{fmtDate(s.start_at)} — {fmtDate(s.end_at)}</td>
                  <td className="px-4 py-2 text-sm">{fmtVND(s.plan?.price_per_month)}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(s)}
                        className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
                      >Sửa</button>
                      <button
                        onClick={() => remove(s.id)}
                        className="rounded-lg border border-red-700 px-3 py-1 text-sm text-red-300 hover:bg-red-950/40"
                      >Xoá</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-zinc-400">Không có dữ liệu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {creating && <CreateModal onClose={() => setCreating(false)} onSaved={load} />}
      {editing && (
        <EditModal
          sub={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load() }}
        />
      )}
    </div>
  )
}

/* -------------------- Create -------------------- */

function CreateModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const today = new Date()
  const plus30 = new Date(today.getTime() + 30 * 24 * 3600 * 1000)

  const [plansList, setPlansList] = useState<Plan[]>([])
  const [form, setForm] = useState<{ user_id: string; plan_id: string; start_at: string; end_at: string }>({
    user_id: '',
    plan_id: '',
    start_at: today.toISOString().slice(0, 10),
    end_at: plus30.toISOString().slice(0, 10),
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await plans.listPlans()
        setPlansList((r?.data ?? r) || [])
      } catch {}
    })()
  }, [])

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function submit() {
    if (!form.user_id || !form.plan_id) return alert('Nhập User ID và chọn Plan!')
    setSaving(true)
    try {
      await subs.createSubscription({
        user_id: Number(form.user_id),
        plan_id: Number(form.plan_id),
        start_at: form.start_at,
        end_at: form.end_at,
      })
      onSaved()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Tạo đăng ký thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tạo đăng ký</h2>
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800">Đóng</button>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">User ID</label>
            <input
              type="number"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.user_id}
              onChange={(e) => set('user_id', e.target.value)}
              placeholder="VD: 10"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Plan</label>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.plan_id}
              onChange={(e) => set('plan_id', e.target.value)}
            >
              <option value="">-- Chọn gói --</option>
              {plansList.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Bắt đầu</label>
              <input type="date" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                     value={form.start_at} onChange={e => set('start_at', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Kết thúc</label>
              <input type="date" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                     value={form.end_at} onChange={e => set('end_at', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">Hủy</button>
          <button disabled={saving} onClick={submit}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {saving ? 'Đang tạo…' : 'Tạo'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Edit (đổi plan hoặc gia hạn) -------------------- */

function EditModal({
  sub, onClose, onSaved,
}: { sub: Subscription; onClose: () => void; onSaved: () => void }) {
  const [plansList, setPlansList] = useState<Plan[]>([])
  const [planId, setPlanId] = useState<string>(String(sub.plan_id))
  const [endDate, setEndDate] = useState<string>(sub.end_at?.slice(0, 10) || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await plans.listPlans()
        setPlansList((r?.data ?? r) || [])
      } catch {}
    })()
  }, [])

  async function submit() {
    setSaving(true)
    try {
      // Backend của bạn đọc field "end_date" (nếu BE dùng "end_at", chỉ cần đổi key bên dưới)
      await subs.updateSubscription(sub.id, {
        plan_id: Number(planId),
        end_date: endDate || undefined,
        // end_at: endDate || undefined, // nếu server yêu cầu end_at thì dùng dòng này và bỏ end_date
      })
      onSaved()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sửa đăng ký #{sub.id}</h2>
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800">Đóng</button>
        </div>

        <div className="grid gap-3">
          <div className="text-sm text-zinc-400">
            User: <span className="text-white">{sub.user?.email || sub.user_id}</span>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Đổi gói</label>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              {plansList.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Gia hạn đến</label>
            <input
              type="date"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <p className="mt-1 text-xs text-zinc-500">Hiện tại: {fmtDate(sub.end_at)}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">Hủy</button>
          <button disabled={saving} onClick={submit}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {saving ? 'Đang lưu…' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  )
}
