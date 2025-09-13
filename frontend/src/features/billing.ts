// src/features/billing.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type Plan = {
  id: number
  name: string
  price_per_month: number | string
  max_quality?: string
  is_active?: boolean
}

export type Subscription = {
  id: number
  user_id: number
  plan_id: number
  start_at: string
  end_at: string
  status: 'active'|'canceled'|'expired'
  created_at?: string
  plan?: Plan
  user?: any
}

function tokenOrThrow() {
  const { token, isAuthenticated } = getSession()
  if (!isAuthenticated || !token) throw Object.assign(new Error('Login required'), { status: 401 })
  return token
}

// ===== New utils =====
export function normalizePrice(v: number | string | undefined): number {
  if (v == null) return 0
  if (typeof v === 'number') return v
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
export function priceYearly(v: number | string | undefined): number {
  return normalizePrice(v) * 12
}
export function daysLeft(endISO?: string): number {
  if (!endISO) return 0
  const end = new Date(endISO).getTime()
  const now = Date.now()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

// ===== APIs =====
export async function listPlans(): Promise<Plan[]> {
  const token = tokenOrThrow()
  const r: any = await api.getApiV1Plans(undefined, token)
  const arr: Plan[] = r?.data ?? r ?? []
  return Array.isArray(arr) ? arr : []
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const token = tokenOrThrow()
  const r: any = await api.getApiV1Subscriptions(undefined, token)
  const arr: Subscription[] = r?.data ?? r ?? []
  return Array.isArray(arr) ? arr : []
}

export async function getMyActiveSubscription(): Promise<Subscription | null> {
  const subs = await listSubscriptions()
  const { payload } = getSession()
  const myId = Number(payload?.id)
  const mine = subs.filter(s => s.user_id === myId)
  const active = mine.find(s => s.status === 'active')
  if (active) return active
  mine.sort((a,b) => new Date(b.end_at).getTime() - new Date(a.end_at).getTime())
  return mine[0] ?? null
}

export async function createSubscription(plan_id: number) {
  const token = tokenOrThrow()
  const { payload } = getSession()
  const user_id = Number(payload?.id)

  const start = new Date()
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)

  const body = {
    user_id,
    plan_id,
    start_at: start.toISOString().slice(0,10),
    end_at:   end.toISOString().slice(0,10),
  }
  return api.postApiV1Subscriptions(body, undefined, token)
}

export async function cancelSubscription(id: number) {
  const token = tokenOrThrow()
  return api.deleteApiV1SubscriptionsById(id, undefined, undefined, token)
}

export async function switchPlan(current: Subscription | null, newPlanId: number) {
  if (current?.status === 'active' && current?.id) {
    await cancelSubscription(current.id)
  }
  return createSubscription(newPlanId)
}

export async function renewPlan(current: Subscription) {
  if (!current?.plan_id) throw new Error('Missing plan_id to renew')
  return createSubscription(current.plan_id)
}
