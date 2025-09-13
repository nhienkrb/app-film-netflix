// src/features/plans.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type Plan = {
  id: number
  name: string
  price_per_month: number | string
  max_quality?: string
  is_active?: boolean
  description?: string
}

export type PlanCreateReq = {
  name: string
  price_per_month: number
  description?: string
  // max_quality / is_active nếu backend cho phép set khi create thì bổ sung tại đây
}

export type PlanUpdateReq = {
  name?: string
  price_per_month?: number
  description?: string
  // max_quality / is_active nếu backend cho phép update thì thêm tại đây
}

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

export async function listPlans() {
  ensureAuth()
  return api.getApiV1Plans()
}

export async function getPlan(id: number) {
  ensureAuth()
  return api.getApiV1PlansById(id)
}

export async function createPlan(body: PlanCreateReq) {
  ensureAuth()
  return api.postApiV1Plans(body)
}

export async function updatePlan(id: number, body: PlanUpdateReq) {
  ensureAuth()
  return api.putApiV1PlansById(id, body)
}

export async function deletePlan(id: number) {
  ensureAuth()
  return api.deleteApiV1PlansById(id)
}
