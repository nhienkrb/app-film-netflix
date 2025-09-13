// src/pages/SubscriptionsDemo.tsx
import React from 'react'
import * as subs from '../features/subscriptions'

export default function SubscriptionsDemo() {
  const [list, setList] = React.useState<any[]>([])
  const [id, setId] = React.useState<number>(1)

  // form create
  const [userId, setUserId] = React.useState<number>(8)
  const [planId, setPlanId] = React.useState<number>(8)
  const [startAt, setStartAt] = React.useState<string>('2025-09-07')
  const [endAt, setEndAt] = React.useState<string>('2025-10-07')

  // form update
  const [updPlanId, setUpdPlanId] = React.useState<number>(8)
  const [updEndDate, setUpdEndDate] = React.useState<string>('2025-11-07')

  const [msg, setMsg] = React.useState<string>('')

  async function reload() {
    setMsg('')
    const r = await subs.listSubscriptions()
    setList((r as any)?.data || [])
  }

  async function createOne(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    try {
      const r = await subs.createSubscription({
        user_id: userId,
        plan_id: planId,
        start_at: startAt,
        end_at: endAt
      })
      setMsg('CREATE: ' + JSON.stringify(r, null, 2))
      await reload()
    } catch (e:any) {
      setMsg(`CREATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function getOne() {
    setMsg('')
    try {
      const r = await subs.getSubscription(id)
      setMsg('GET: ' + JSON.stringify(r, null, 2))
    } catch (e:any) {
      setMsg(`GET ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function updateOne(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    try {
      // LƯU Ý: nếu BE yêu cầu 'end_at' thay cho 'end_date', đổi key tại đây
      const r = await subs.updateSubscription(id, { plan_id: updPlanId, end_date: updEndDate })
      setMsg('UPDATE: ' + JSON.stringify(r, null, 2))
      await reload()
    } catch (e:any) {
      setMsg(`UPDATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function deleteOne() {
    setMsg('')
    try {
      const r = await subs.deleteSubscription(id)
      setMsg('DELETE: ' + JSON.stringify(r, null, 2))
      await reload()
    } catch (e:any) {
      setMsg(`DELETE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  React.useEffect(() => { reload() }, [])

  return (
    <div className="p-6 space-y-6 text-sm">
      <h1 className="text-lg font-semibold">Subscriptions Demo</h1>

      {/* Create */}
      <form className="grid md:grid-cols-2 gap-3" onSubmit={e=>e.preventDefault()}>
        <div className="space-y-2">
          <div className="font-medium">Create</div>
          <input className="border px-3 py-2 rounded w-full" type="number"
                 value={userId} onChange={e=>setUserId(parseInt(e.target.value||'0'))} placeholder="user_id" />
          <input className="border px-3 py-2 rounded w-full" type="number"
                 value={planId} onChange={e=>setPlanId(parseInt(e.target.value||'0'))} placeholder="plan_id" />
          <input className="border px-3 py-2 rounded w-full" type="date"
                 value={startAt} onChange={e=>setStartAt(e.target.value)} placeholder="start_at (YYYY-MM-DD)" />
          <input className="border px-3 py-2 rounded w-full" type="date"
                 value={endAt} onChange={e=>setEndAt(e.target.value)} placeholder="end_at (YYYY-MM-DD)" />
          <button className="border px-3 py-2 rounded" onClick={createOne}>Create</button>
        </div>

        {/* Get / Update / Delete */}
        <div className="space-y-2">
          <div className="font-medium">Get / Update / Delete</div>
          <input className="border px-3 py-2 rounded w-full" type="number"
                 value={id} onChange={e=>setId(parseInt(e.target.value||'0'))} placeholder="subscription id" />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={getOne}>Get by ID</button>
            <button className="border px-3 py-2 rounded" onClick={deleteOne}>Delete</button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <input className="border px-3 py-2 rounded w-full" type="number"
                   value={updPlanId} onChange={e=>setUpdPlanId(parseInt(e.target.value||'0'))} placeholder="plan_id (update)" />
            <input className="border px-3 py-2 rounded w-full" type="date"
                   value={updEndDate} onChange={e=>setUpdEndDate(e.target.value)} placeholder="end_date (update)" />
            <button className="border px-3 py-2 rounded" onClick={updateOne}>Update</button>
          </div>
        </div>
      </form>

      {msg && (
        <pre className="bg-green-50 border border-green-200 rounded p-2 whitespace-pre-wrap">{msg}</pre>
      )}

      {/* List */}
      <div>
        <div className="font-medium mb-2">Subscriptions list</div>
        <div className="grid gap-2">
          {list.map((s:any) => (
            <div key={s.id} className="border rounded p-3">
              <div className="font-semibold">#{s.id} • {s.status}</div>
              <div>user_id: {s.user_id}</div>
              <div>plan_id: {s.plan_id}</div>
              <div>start_at: {s.start_at}</div>
              <div>end_at: {s.end_at}</div>
              {s.user && <div className="text-xs text-gray-600">user.email: {s.user.email}</div>}
              {s.plan && <div className="text-xs text-gray-600">plan: {s.plan.name} ({s.plan.max_quality})</div>}
            </div>
          ))}
          {list.length === 0 && <div className="text-gray-500">No subscriptions</div>}
        </div>
      </div>
    </div>
  )
}
