// src/admin/PlansAdmin.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as plansApi from '../features/plans'
import { getSession } from '../lib/auth'

type Plan = plansApi.Plan

function currencyVND(v: number | string | undefined) {
  if (v === undefined) return '—'
  const n = typeof v === 'string' ? Number(v) : v
  if (isNaN(n)) return String(v)
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function PlansAdmin() {
  const nav = useNavigate()
  const { isAuthenticated } = getSession()

  const [items, setItems] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState<Plan | null>(null) // null = modal off
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return items
    return items.filter(p =>
      [p.name, String(p.price_per_month || ''), p.description || '', p.max_quality || '']
        .join(' ')
        .toLowerCase()
        .includes(k),
    )
  }, [items, keyword])

  async function load() {
    setLoading(true); setError(null)
    try {
      const r = await plansApi.listPlans()
      const arr: Plan[] = (r?.data ?? r) || []
      setItems(arr)
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) {
        nav('/login', { replace: true }); return
      }
      setError(e?.body?.message || e?.message || 'Không tải được danh sách gói')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (!isAuthenticated) nav('/login', { replace: true }); else load() }, []) // eslint-disable-line

  async function remove(id: number) {
    if (!confirm('Xoá gói này?')) return
    try {
      await plansApi.deletePlan(id)
      await load()
    } catch (e: any) {
      alert(e?.body?.message || 'Xoá thất bại')
    }
  }

  if (!isAuthenticated) return null
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Plans</h1>
        <div className="ml-auto flex gap-2">
          <input
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
            placeholder="Tìm theo tên hoặc code…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Thêm gói
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
                <th className="px-4 py-2 text-left text-sm font-medium">Tên</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Giá</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Chất lượng</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Active</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Mô tả</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((p, i) => (
                <tr key={p.id ?? i} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-2 text-sm text-zinc-400">{i + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-white">{p.name}</td>
                  <td className="px-4 py-2 text-sm">{currencyVND(p.price_per_month)}</td>
                  <td className="px-4 py-2 text-sm">{p.max_quality || '—'}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? 'bg-green-900/30 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {p.is_active ? 'true' : 'false'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-zinc-300">{p.description || '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
                      >Sửa</button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-lg border border-red-700 px-3 py-1 text-sm text-red-300 hover:bg-red-950/40"
                      >Xoá</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-400">
                    Không có mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <PlanModal
          mode={creating ? 'create' : 'edit'}
          initial={editing || undefined}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={async () => { setCreating(false); setEditing(null); await load() }}
        />
      )}
    </div>
  )
}

/* ------------ Modal tạo/sửa gói ------------ */

function PlanModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit'
  initial?: Plan
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Partial<Plan>>({
    name: initial?.name || '',
    price_per_month: typeof initial?.price_per_month === 'string' ? Number(initial?.price_per_month) : initial?.price_per_month || 0,
    description: initial?.description || '',
    max_quality: initial?.max_quality || 'FHD',
    is_active: initial?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const isEdit = mode === 'edit'

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function submit() {
    setSaving(true)
    try {
      if (isEdit && initial?.id) {
        await plansApi.updatePlan(initial.id, {
          name: form.name,
          price_per_month: Number(form.price_per_month || 0),
          description: form.description,
        })
      } else {
        await plansApi.createPlan({
          name: String(form.name || '').trim(),
          price_per_month: Number(form.price_per_month || 0),
          description: form.description,
        })
      }
      onSaved()
    } catch (e: any) {
      alert(e?.body?.message || e?.message || 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? 'Sửa gói' : 'Thêm gói'}</h2>
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800">Đóng</button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Tên gói</label>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.name as any}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Giá (đ/tháng)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.price_per_month as any}
              onChange={(e) => set('price_per_month', Number(e.target.value || 0))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Max quality</label>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.max_quality as any}
              onChange={(e) => set('max_quality', e.target.value)}
              disabled
              title="Trường này hiện BE không nhận khi create/update — chỉ hiển thị."
            >
              {['SD', 'HD', 'FHD', 'UHD', '4K'].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Kích hoạt</label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                disabled
                title="Trường này hiện BE không nhận khi create/update — chỉ hiển thị."
              />
              <span className="text-zinc-300">Active</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">Mô tả</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.description as any}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">Hủy</button>
          <button
            disabled={saving}
            onClick={submit}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {saving ? 'Đang lưu…' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  )
}
