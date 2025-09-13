// src/features/statistical.ts
import api from '../api'
import { getSession } from '../lib/auth'

export type RevenueTotalResp = { success?: boolean; revenue?: number } | any
export type RevenueMonthlyItem = { month?: number; revenue?: number } | any
export type RevenueMonthlyResp = { success?: boolean; revenue?: RevenueMonthlyItem[] } | any
export type TopRatedItem = {
  id: number
  title: string
  poster_url: string | null
  avg_rating: string | null
  rating_count: number
}
export type TopRatedResp = { success?: boolean; revenue?: TopRatedItem[] } | any

function ensureAuth() {
  const s = getSession()
  if (!s.isAuthenticated) {
    const e: any = new Error('Missing/expired token. Please login.')
    e.code = 'AUTH_REQUIRED'
    throw e
  }
}

/** Tổng doanh thu */
export async function getRevenueTotal(): Promise<RevenueTotalResp> {
  ensureAuth()
  return api.getApiV1StatisticalRevenue()
}

/** Doanh thu theo tháng của 1 năm (vd: 2025) */
export async function getRevenueMonthlyByYear(year: number | string): Promise<RevenueMonthlyResp> {
  ensureAuth()
  return api.getApiV1StatisticalRevenueMonthlyByYear(year)
}

/** Top-rated movies (theo backend trả về trong field "revenue") */
export async function getTopRated(): Promise<TopRatedResp> {
  ensureAuth()
  return api.getApiV1StatisticalRevenueTopRated()
}
