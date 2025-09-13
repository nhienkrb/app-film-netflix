// src/components/billing/SubscriptionBanner.tsx
import React from 'react'
import type { Subscription } from '../../features/billing'
import { daysLeft } from '../../features/billing'

type Props = {
  current: Subscription | null
  onCancel: () => void
  onRenew: () => void
  busy?: boolean
}

function badgeColor(status?: string) {
  switch (status) {
    case 'active': return 'bg-green-900/30 text-green-400'
    case 'expired': return 'bg-zinc-700 text-zinc-200'
    case 'canceled': return 'bg-red-900/30 text-red-400'
    default: return 'bg-zinc-800 text-zinc-300'
  }
}

export default function SubscriptionBanner({ current, onCancel, onRenew, busy }: Props) {
  const fmt = (s?: string) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—')
  const st = current?.status
  const remain = current?.status === 'active' ? daysLeft(current?.end_at) : 0

  return (
    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-zinc-400">
            Gói hiện tại:{' '}
            <span className="font-medium text-white">
              {current?.plan?.name ?? 'Chưa đăng ký'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`rounded-full px-2 py-0.5 text-xs ${badgeColor(st)}`}>
              {st ?? 'none'}
            </span>
            {st === 'active' && (
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
                Còn {remain} ngày
              </span>
            )}
          </div>
          {current && (
            <div className="text-xs text-zinc-500">
              Kỳ hiện tại: {fmt(current.start_at)} – {fmt(current.end_at)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
            onClick={() => alert('(Placeholder) Mở trang quản lý thanh toán')}
          >
            Quản lý thanh toán
          </button>
          <button
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
            onClick={() => alert('(Placeholder) Lịch sử & hoá đơn')}
          >
            Lịch sử & hoá đơn
          </button>

          <button
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 disabled:opacity-50"
            onClick={onCancel}
            disabled={busy || !current?.id || current?.status !== 'active'}
            title={!current?.id ? 'Chưa có gói để hủy' : ''}
          >
            {busy ? 'Đang hủy…' : 'Hủy gói'}
          </button>

          <button
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            onClick={onRenew}
            disabled={busy || !current?.id || current?.status === 'active'}
            title={current?.status === 'active' ? 'Gói đang hoạt động' : ''}
          >
            {busy ? 'Đang xử lý…' : 'Gia hạn'}
          </button>
        </div>
      </div>
    </div>
  )
}
