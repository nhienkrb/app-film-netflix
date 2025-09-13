import React from 'react'
import * as plans from '../features/plans'

// Helper nhỏ để hiển thị tiền tệ VNĐ (tuỳ chọn)
function vnd(n: any) {
  const x = typeof n === 'string' ? Number(n) : n
  if (!Number.isFinite(x)) return String(n)
  return x.toLocaleString('vi-VN') + ' ₫'
}

export default function PlansDemo() {
  // Form & state
  const [list, setList] = React.useState<any[]>([])
  const [id, setId] = React.useState<number>(1)

  const [name, setName] = React.useState('Premium')
  const [price, setPrice] = React.useState<number>(199000)
  const [description, setDescription] = React.useState('Full HD, 4 screens')

  const [msg, setMsg] = React.useState<string>('')

  // Actions
  async function loadList() {
    setMsg('')
    const r = await plans.listPlans()
    setList((r as any)?.data || [])
  }

  async function loadOne() {
    setMsg('')
    const r = await plans.getPlan(id)
    setMsg('GET: ' + JSON.stringify(r, null, 2))
  }

  async function createOne(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    const r = await plans.createPlan({
      name,
      price_per_month: price,
      description
    })
    setMsg('CREATE: ' + JSON.stringify(r, null, 2))
    await loadList()
  }

  async function updateOne(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    const r = await plans.updatePlan(id, {
      name,
      price_per_month: price,
      description
    })
    setMsg('UPDATE: ' + JSON.stringify(r, null, 2))
    await loadList()
  }

  async function deleteOne() {
    setMsg('')
    const r = await plans.deletePlan(id)
    setMsg('DELETE: ' + JSON.stringify(r, null, 2))
    await loadList()
  }

  React.useEffect(() => { loadList() }, [])

  return (
    <div className="p-6 space-y-6 text-sm">
      <h1 className="text-lg font-semibold">Plans Demo</h1>

      {/* Form điều khiển */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={e => e.preventDefault()}>
        <div className="space-y-2">
          <div className="font-medium">Create / Update</div>
          <input className="border px-3 py-2 rounded w-full"
                 placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border px-3 py-2 rounded w-full"
                 placeholder="Price per month"
                 type="number" value={price}
                 onChange={e=>setPrice(parseInt(e.target.value||'0'))} />
          <input className="border px-3 py-2 rounded w-full"
                 placeholder="Description" value={description}
                 onChange={e=>setDescription(e.target.value)} />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={createOne}>Create</button>
            <button className="border px-3 py-2 rounded" onClick={updateOne}>Update</button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Get / Delete</div>
          <input className="border px-3 py-2 rounded w-full"
                 placeholder="Plan ID" type="number" value={id}
                 onChange={e=>setId(parseInt(e.target.value||'0'))} />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={loadOne}>Get by ID</button>
            <button className="border px-3 py-2 rounded" onClick={deleteOne}>Delete</button>
          </div>
          <button className="border px-3 py-2 rounded" onClick={loadList}>Reload list</button>
        </div>
      </form>

      {msg && (
        <div className="bg-green-50 border border-green-200 rounded p-3 whitespace-pre-wrap">
          {msg}
        </div>
      )}

      <div>
        <div className="font-medium mb-2">Plans list</div>
        <div className="grid gap-2">
          {list.map((p:any) => (
            <div key={p.id} className="border rounded p-3">
              <div className="font-semibold">{p.name}</div>
              <div>id: {p.id}</div>
              <div>price_per_month: {vnd(p.price_per_month)}</div>
              {p.max_quality != null && <div>max_quality: {String(p.max_quality)}</div>}
              {p.is_active != null && <div>is_active: {String(p.is_active)}</div>}
              {p.description && <div>description: {p.description}</div>}
            </div>
          ))}
          {list.length === 0 && <div className="text-gray-500">No plans</div>}
        </div>
      </div>
    </div>
  )
}
