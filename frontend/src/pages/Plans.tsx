import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getSession } from '../lib/auth'
import SubscriptionBanner from '../components/billing/SubscriptionBanner'
import PlanCard from '../components/billing/PlanCard'

type Plan = {
  id: number
  name: string
  price_per_month: number | string
  max_quality?: string
  is_active?: boolean
}

type Subscription = {
  id: number
  user_id: number
  plan_id: number
  start_at: string
  end_at: string
  status: string
  plan?: Plan
}

export default function Plans() {
  const navigate = useNavigate()
  const { isAuthenticated, token, payload } = getSession()

  // Nếu chưa login → chuyển sang /login
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  const [plans, setPlans] = useState<Plan[]>([])
  const [current, setCurrent] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

const userId = (payload?.id as number | undefined)
  const authToken = token || undefined
  async function load() {
    if (!authToken || !userId) return
    setLoading(true); setMsg('')
    try {
      const pResp: any = await api.getApiV1Plans(undefined, authToken)
      setPlans(pResp?.data ?? [])

      const sResp: any = await api.getApiV1Subscriptions(undefined, authToken)
      const mine: Subscription[] = (sResp?.data ?? []).filter((s: any) => s.user_id === userId)
      const active = mine.find(m => m.status === 'active')
      setCurrent(active ?? null)
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) {
        navigate('/login', { replace: true }); return
      }
      setMsg(e?.body?.message || 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isAuthenticated) load() }, [isAuthenticated])

  async function choose(planId: number) {
    if (!authToken || !userId) return
    // Nếu đã có gói active thì buộc phải hủy trước
    if (current?.status === 'active') {
      alert('Bạn đã có gói hoạt động. Hãy hủy trước khi chọn gói khác.')
      return
    }
    try {
      setBusy(true); setMsg('')
      const body = {
        user_id: userId,
        plan_id: planId,
        start_at: new Date().toISOString().slice(0, 10),
        end_at: (() => {
          const d = new Date()
          d.setMonth(d.getMonth() + 1)
          return d.toISOString().slice(0, 10)
        })()
      }
      const r = await api.postApiV1Subscriptions(body, undefined, authToken)
      setMsg(r?.message || 'Đăng ký gói thành công')
      await load()
    } catch (e: any) {
      setMsg(e?.body?.message || 'Không thể đăng ký gói')
    } finally {
      setBusy(false)
    }
  }

  async function cancel() {
    if (!authToken || !current?.id) return
    const ok = window.confirm('Bạn chắc chắn muốn hủy gói hiện tại?')
    if (!ok) return
    try {
      setBusy(true); setMsg('')
      const r = await api.deleteApiV1SubscriptionsById(current.id, undefined, undefined, authToken)
      setMsg(r?.message || 'Đã hủy gói')
      await load()
    } catch (e: any) {
      setMsg(e?.body?.message || 'Không thể hủy gói')
    } finally {
      setBusy(false)
    }
  }

  if (!isAuthenticated) return null
  if (loading) return <div className="p-6">Đang tải…</div>

  return (
    <div className="px-6">
      <h1 className="mb-2 text-2xl font-bold">Chọn gói dịch vụ</h1>
      <p className="mb-4 text-zinc-400">Không quảng cáo, chất lượng cao, hủy bất kỳ lúc nào.</p>

      <SubscriptionBanner
        current={current}
        onCancel={cancel}
        onRenew={() => alert('BE chưa hỗ trợ renew trực tiếp')}
        busy={busy}
      />

      {msg && <div className="mb-4 rounded border border-zinc-700 bg-zinc-900 p-3 text-sm">{msg}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map(p => (
          <PlanCard
            key={p.id}
            plan={p}
            current={current}
            onChoose={choose}
          />
        ))}
      </div>
    </div>
  )
}
