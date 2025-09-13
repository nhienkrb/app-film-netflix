// src/pages/StatisticalDemo.tsx
import React from 'react'
import { getRevenueTotal, getRevenueMonthlyByYear, getTopRated } from '../features/statistical'

function vnd(n: any) {
  const x = Number(n)
  if (!Number.isFinite(x)) return String(n)
  return x.toLocaleString('vi-VN') + ' ₫'
}

export default function StatisticalDemo() {
  const [year, setYear] = React.useState<number>(2025)

  const [total, setTotal] = React.useState<any>(null)
  const [monthly, setMonthly] = React.useState<any>(null)
  const [topRated, setTopRated] = React.useState<any>(null)
  const [msg, setMsg] = React.useState<string>('')

  async function loadTotal() {
    setMsg('')
    try {
      const r = await getRevenueTotal()
      setTotal(r)
    } catch (e: any) {
      setMsg(`TOTAL ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function loadMonthly() {
    setMsg('')
    try {
      const r = await getRevenueMonthlyByYear(year)
      setMonthly(r)
    } catch (e: any) {
      setMsg(`MONTHLY ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function loadTopRated() {
    setMsg('')
    try {
      const r = await getTopRated()
      setTopRated(r)
    } catch (e: any) {
      setMsg(`TOP-RATED ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  React.useEffect(() => { loadTotal(); loadMonthly(); loadTopRated() }, [])

  return (
    <div className="p-6 space-y-6 text-sm">
      <h1 className="text-lg font-semibold">Statistical Demo</h1>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="font-medium">Controls</div>
          <input
            className="border px-3 py-2 rounded w-36"
            type="number"
            value={year}
            onChange={e => setYear(parseInt(e.target.value || '0'))}
            placeholder="Year"
          />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={loadTotal}>Reload total</button>
            <button className="border px-3 py-2 rounded" onClick={loadMonthly}>Reload monthly</button>
            <button className="border px-3 py-2 rounded" onClick={loadTopRated}>Reload top-rated</button>
          </div>
        </div>

        {msg && (
          <pre className="bg-red-50 border border-red-200 rounded p-2 whitespace-pre-wrap">{msg}</pre>
        )}
      </div>

      <div>
        <div className="font-medium mb-1">Total revenue</div>
        <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
          {total ? JSON.stringify(total, null, 2) : '—'}
        </pre>
        {total?.revenue != null && <div className="text-xs text-gray-600 mt-1">Formatted: {vnd(total.revenue)}</div>}
      </div>

      <div>
        <div className="font-medium mb-1">Monthly revenue ({year})</div>
        <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
          {monthly ? JSON.stringify(monthly, null, 2) : '—'}
        </pre>
      </div>

      <div>
        <div className="font-medium mb-1">Top rated</div>
        <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
          {topRated ? JSON.stringify(topRated, null, 2) : '—'}
        </pre>
      </div>
    </div>
  )
}
