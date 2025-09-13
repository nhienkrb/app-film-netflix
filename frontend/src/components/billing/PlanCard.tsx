// src/components/billing/PlanCard.tsx
import React from 'react'
import type { Plan, Subscription } from './SubscriptionBanner' // dùng type chung

export default function PlanCard({
  plan,
  current,
  onChoose,
}: {
  plan: Plan
  current?: Subscription | null
  onChoose: (id: number) => void
}) {
  const isCurrent = current?.plan_id === plan.id && current?.status === 'active'
  const hasActive = current?.status === 'active'
  const price = Number(plan.price_per_month) || 0
  const yearly = price * 12

  return (
    <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      {isCurrent && (
        <div className="absolute right-3 top-3 rounded-full bg-green-900/30 px-2 py-0.5 text-xs text-green-400">
          Đang dùng
        </div>
      )}

      <div className="mb-2 text-lg font-semibold">{plan.name}</div>

      <div className="mb-3 space-y-1">
        <div>
          <span className="text-2xl font-bold">{price.toLocaleString('vi-VN')}</span>
          <span className="text-sm text-zinc-400"> đ / tháng</span>
        </div>
        <div className="text-xs text-zinc-400">
          ≈ <span className="font-medium text-zinc-200">{yearly.toLocaleString('vi-VN')}</span> đ / năm
        </div>
      </div>

      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-zinc-300">
        {plan.max_quality && <li>Chất lượng tối đa: {plan.max_quality}</li>}
        <li>{plan.is_active === false ? 'Tạm dừng bán' : 'Đang mở bán'}</li>
      </ul>

      <button
        onClick={() => onChoose(plan.id)}
        disabled={hasActive || plan.is_active === false}
        className={`w-full rounded-lg py-2 text-sm font-medium
          ${hasActive || plan.is_active === false
            ? 'cursor-not-allowed opacity-50 border border-zinc-700 text-zinc-500'
            : 'border border-zinc-600 text-white hover:bg-zinc-800'}`}
        title={hasActive ? 'Bạn đang có gói active, hãy hủy trước khi chọn gói khác' : ''}
      >
        {isCurrent ? 'Gói hiện tại' : 'Chọn gói'}
      </button>
    </div>
  )
}
