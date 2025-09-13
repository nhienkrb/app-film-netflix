import React from 'react'
import * as profiles from '../features/profiles'

export default function ProfilesDemo() {
  const [id, setId] = React.useState<number>(1)
  const [name, setName] = React.useState('Admin')
  const [maturity, setMaturity] = React.useState<string>('')

  const [msg, setMsg] = React.useState<string>('')

  async function getOne() {
    setMsg('')
    try {
      const r = await profiles.getProfile(id)
      setMsg('GET: ' + JSON.stringify(r, null, 2))
    } catch (e:any) {
      setMsg(`GET ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }
  async function createOne() {
    setMsg('')
    try {
      const r = await profiles.createProfile({ name, maturity_level: maturity || null })
      setMsg('CREATE: ' + JSON.stringify(r, null, 2))
    } catch (e:any) {
      setMsg(`CREATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }
  async function updateOne() {
    setMsg('')
    try {
      const r = await profiles.updateProfile(id, { name, maturity_level: maturity || null })
      setMsg('UPDATE: ' + JSON.stringify(r, null, 2))
    } catch (e:any) {
      setMsg(`UPDATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }
  async function deleteOne() {
    setMsg('')
    try {
      const r = await profiles.deleteProfile(id)
      setMsg('DELETE: ' + JSON.stringify(r, null, 2))
    } catch (e:any) {
      setMsg(`DELETE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  return (
    <div className="p-6 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Profiles Demo (placeholder)</h1>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="font-medium">Params</div>
          <input className="border px-3 py-2 rounded w-full" type="number" value={id} onChange={e=>setId(parseInt(e.target.value||'0'))} placeholder="Profile ID" />
          <input className="border px-3 py-2 rounded w-full" value={name} onChange={e=>setName(e.target.value)} placeholder="name" />
          <input className="border px-3 py-2 rounded w-full" value={maturity} onChange={e=>setMaturity(e.target.value)} placeholder="maturity_level (or empty for null)" />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={getOne}>GET</button>
            <button className="border px-3 py-2 rounded" onClick={createOne}>CREATE</button>
            <button className="border px-3 py-2 rounded" onClick={updateOne}>UPDATE</button>
            <button className="border px-3 py-2 rounded" onClick={deleteOne}>DELETE</button>
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Result</div>
          <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">{msg}</pre>
          <div className="text-xs text-gray-500 mt-2">
            *Hiện backend trả "Route not found". Khi BE mở route, chỉ cần cập nhật path trong <code>api_resource.ts</code> (nhóm Profiles).
          </div>
        </div>
      </div>
    </div>
  )
}
