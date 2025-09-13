// src/pages/UsersDemo.tsx
import React from 'react'
import * as users from '../features/users'

export default function UsersDemo() {
  const [me, setMe] = React.useState<any>(null)
  const [list, setList] = React.useState<any[]>([])
  const [msg, setMsg] = React.useState<string>('')

  // form create
  const [displayName, setDisplayName] = React.useState('Nguyen Van A')
  const [email, setEmail] = React.useState('vana1@example.com')
  const [password, setPassword] = React.useState('123456')

  // form update/delete
  const [id, setId] = React.useState<number>(11)
  const [updName, setUpdName] = React.useState('Nguyen Van B')
  const [updEmail, setUpdEmail] = React.useState('vanb@example.com')

  async function loadMe() {
    setMsg('')
    try {
      const r = await users.getMe()
      setMe(r)
    } catch (e:any) {
      setMsg(`ME ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function loadAll() {
    setMsg('')
    try {
      const r = await users.listUsers()
      setList((r as any)?.data || [])
    } catch (e:any) {
      setMsg(`LIST ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function doCreate(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    try {
      const r = await users.createUser({ display_name: displayName, email, password })
      setMsg('CREATE: ' + JSON.stringify(r, null, 2))
      await loadAll()
    } catch (e:any) {
      setMsg(`CREATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function doUpdate(e?: React.FormEvent) {
    e?.preventDefault()
    setMsg('')
    try {
      const r = await users.updateUser(id, { display_name: updName, email: updEmail })
      setMsg('UPDATE: ' + JSON.stringify(r, null, 2))
      await loadAll()
    } catch (e:any) {
      setMsg(`UPDATE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function doDelete() {
    setMsg('')
    try {
      const r = await users.deleteUser(id)
      setMsg('DELETE: ' + JSON.stringify(r, null, 2))
      await loadAll()
    } catch (e:any) {
      setMsg(`DELETE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  React.useEffect(() => { loadMe(); loadAll() }, [])

  return (
    <div className="p-6 space-y-6 text-sm">
      <h1 className="text-lg font-semibold">Users Demo</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-medium">Create user</div>
          <input className="border px-3 py-2 rounded w-full" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="display_name" />
          <input className="border px-3 py-2 rounded w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
          <input className="border px-3 py-2 rounded w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          <button className="border px-3 py-2 rounded" onClick={doCreate}>Create</button>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Get me / Update / Delete</div>
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={loadMe}>Load me</button>
            <button className="border px-3 py-2 rounded" onClick={loadAll}>Reload list</button>
          </div>
          <input className="border px-3 py-2 rounded w-full" type="number" value={id} onChange={e=>setId(parseInt(e.target.value||'0'))} placeholder="user id" />
          <input className="border px-3 py-2 rounded w-full" value={updName} onChange={e=>setUpdName(e.target.value)} placeholder="display_name (update)" />
          <input className="border px-3 py-2 rounded w-full" value={updEmail} onChange={e=>setUpdEmail(e.target.value)} placeholder="email (update)" />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={doUpdate}>Update</button>
            <button className="border px-3 py-2 rounded" onClick={doDelete}>Delete</button>
          </div>
        </div>
      </div>

      {msg && <pre className="bg-green-50 border border-green-200 rounded p-2 whitespace-pre-wrap">{msg}</pre>}

      <div>
        <div className="font-medium mb-2">Users list</div>
        <div className="grid gap-2">
          {list.map((u:any) => (
            <div key={u.id} className="border rounded p-3">
              <div>id: {u.id}</div>
              {'name' in u && <div>name: {u.name}</div>}
              {'display_name' in u && <div>display_name: {u.display_name}</div>}
              {'email' in u && <div>email: {u.email}</div>}
            </div>
          ))}
          {list.length === 0 && <div className="text-gray-500">No users</div>}
        </div>
      </div>

      <div>
        <div className="font-medium mb-1">Me</div>
        <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
          {me ? JSON.stringify(me, null, 2) : '—'}
        </pre>
      </div>
    </div>
  )
}
