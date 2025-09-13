// src/features/subscriptions.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type Subscription = {
  id: number
  user_id: number
  plan_id: number
  start_at: string
  end_at: string
  status: 'active' | 'canceled' | 'expired' | string
  created_at?: string
  user?: any
  plan?: any
}

export type SubscriptionCreateReq = {
  user_id: number
  plan_id: number
  start_at: string   // 'YYYY-MM-DD'
  end_at: string     // 'YYYY-MM-DD'
}

export type SubscriptionUpdateReq = {
  // theo cURL bạn gửi: BE nhận { plan_id?, end_date? } (có thể là end_at hoặc end_date)
  plan_id?: number
  end_date?: string  // BE của bạn đang đọc field này; nếu là end_at thì đổi tại đây
  // end_at?: string
}

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

export async function listSubscriptions() {
  ensureAuth()
  return api.getApiV1Subscriptions()
}

export async function createSubscription(body: SubscriptionCreateReq) {
  ensureAuth()
  return api.postApiV1Subscriptions(body)
}

export async function getSubscription(id: number) {
  ensureAuth()
  return api.getApiV1SubscriptionsById(id)
}

export async function updateSubscription(id: number, body: SubscriptionUpdateReq) {
  ensureAuth()
  return api.putApiV1SubscriptionsById(id, body)
}

export async function deleteSubscription(id: number) {
  ensureAuth()
  return api.deleteApiV1SubscriptionsById(id)
}
