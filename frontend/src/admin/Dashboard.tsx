// src/admin/Dashboard.tsx
import React, { useEffect, useMemo, useState } from 'react'
import api from '../api'
import { getSession } from '../lib/auth'
import { Link } from 'react-router-dom'

type TopRatedItem = {
  id: number
  title: string
  poster_url?: string | null
  avg_rating?: string | number | null
  rating_count?: number
}

type MonthPoint = { month: number; value: number }

function currency(n: number) {
  try {
    return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ'
  } catch {
    return String(n) + ' đ'
  }
}

function YearSelect({
  value,
  onChange,
  from = 2020,
  to = new Date().getFullYear() + 1,
}: {
  value: number
  onChange: (y: number) => void
  from?: number
  to?: number
}) {
  const years = []
  for (let y = to; y >= from; y--) years.push(y)
  return (
    <select
      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}

/** Biểu đồ cột đơn giản bằng SVG, không cần lib */
function TinyBarChart({ data }: { data: MonthPoint[] }) {
  const W = 900
  const H = 260
  const P = 24
  const max = Math.max(1, ...data.map((d) => d.value))
  const barW = (W - P * 2) / data.length - 8

  return (
    <div className="w-full overflow-x-auto">
      <svg width={W} height={H} className="min-w-[720px]">
        {/* trục */}
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#303036" />
        {/* cột */}
        {data.map((d, i) => {
          const x = P + i * (barW + 8) + 4
          const h = Math.round(((H - P * 2) * d.value) / max)
          const y = H - P - h
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="6"
                className="fill-zinc-600"
              />
              <text
                x={x + barW / 2}
                y={H - P + 16}
                textAnchor="middle"
                fontSize="10"
                fill="#8b8b92"
              >
                T{i + 1}
              </text>
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#a1a1aa"
              >
                {Math.round(d.value / 1000)}k
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const { token, isAuthenticated } = getSession()
  const authToken = token || undefined // để apiFetch gắn Bearer đúng
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // cards
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0)
  const [topRated, setTopRated] = useState<TopRatedItem[]>([])

  // chart
  const [monthly, setMonthly] = useState<MonthPoint[]>(
    Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 }))
  )

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      // Tổng doanh thu
      const r1 = await api.getApiV1StatisticalRevenue(undefined, authToken)
      setTotalRevenue(Number(r1?.revenue ?? 0))

      // Top rated
      const r3 = await api.getApiV1StatisticalRevenueTopRated(undefined, authToken)
      const list: TopRatedItem[] = (r3?.revenue ?? []) as any[]
      setTopRated(Array.isArray(list) ? list : [])

      // Theo tháng
      const r2 = await api.getApiV1StatisticalRevenueMonthlyByYear(
        year,
        undefined,
        authToken
      )
      // BE của bạn có thể trả: [] (rỗng), hoặc mảng number, hoặc mảng {month, total}
      const raw = (r2?.revenue ?? []) as any[]
      const normalized: MonthPoint[] = Array.from({ length: 12 }, (_, i) => {
        const item = raw[i]
        if (typeof item === 'number') return { month: i + 1, value: item }
        if (item && typeof item === 'object')
          return { month: Number(item.month ?? i + 1), value: Number(item.total ?? 0) }
        return { month: i + 1, value: 0 }
      })
      setMonthly(normalized)

      // Doanh thu tháng hiện tại để hiện card
      const nowM = new Date().getMonth() + 1
      const cur = normalized.find((d) => d.month === nowM)?.value ?? 0
      setThisMonthRevenue(cur)
    } catch (e: any) {
      if (!isAuthenticated) {
        setError('Bạn cần đăng nhập (admin) để xem Dashboard.')
      } else {
        setError(e?.body?.message || e?.message || 'Không tải được dữ liệu.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  const avgTop = useMemo(() => {
    const first = topRated[0]
    if (!first) return { score: 0, title: '—' }
    const score = Number(first.avg_rating ?? 0)
    return { score, title: first.title }
  }, [topRated])

  if (loading) return <div className="p-6">Đang tải Dashboard…</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="px-6 pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-400">Tổng quan doanh thu và phim được đánh giá cao</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Năm:</span>
          <YearSelect value={year} onChange={setYear} />
        </div>
      </div>

      {/* Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Tổng doanh thu</div>
          <div className="mt-1 text-2xl font-semibold">{currency(totalRevenue)}</div>
          <div className="mt-1 text-xs text-zinc-500">Cộng dồn 12 tháng</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Doanh thu tháng này</div>
          <div className="mt-1 text-2xl font-semibold">{currency(thisMonthRevenue)}</div>
          <div className="mt-1 text-xs text-zinc-500">MoM: —</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Top Rated (điểm TB)</div>
          <div className="mt-1 text-2xl font-semibold">
            {avgTop.score ? avgTop.score.toFixed(2) : '—'}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{avgTop.title}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
          <div className="text-sm text-zinc-400">Năm {year}</div>
        </div>
        <TinyBarChart data={monthly} />
      </div>

      {/* Top Rated Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Phim được đánh giá cao</h2>
          <div className="text-sm text-zinc-400">Top {Math.min(10, topRated.length)}</div>
        </div>

        {topRated.length === 0 ? (
          <div className="text-sm text-zinc-400">— Chưa có dữ liệu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Tiêu đề</th>
                  <th className="px-3 py-2 text-left">Điểm TB</th>
                  <th className="px-3 py-2 text-left">Số lượt</th>
                  <th className="px-3 py-2 text-left">Xem</th>
                </tr>
              </thead>
              <tbody>
                {topRated.slice(0, 10).map((m, idx) => (
                  <tr key={m.id} className="border-b border-zinc-800">
                    <td className="px-3 py-2 text-zinc-400">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.poster_url || '/placeholder.png'}
                          alt={m.title}
                          className="h-10 w-7 rounded object-cover"
                        />
                        <span className="font-medium">{m.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{m.avg_rating ?? '—'}</td>
                    <td className="px-3 py-2">{m.rating_count ?? 0}</td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/movie/${m.id}`}
                        className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
