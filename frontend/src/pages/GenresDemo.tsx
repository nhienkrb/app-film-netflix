// src/pages/GenresDemo.tsx
import React from 'react'
import { listGenres, getGenre, createGenre, updateGenre, deleteGenre } from '../features/genres'

export default function GenresDemo() {
  const [list, setList] = React.useState<any[]>([])
  const [id, setId] = React.useState<number>(1)
  const [name, setName] = React.useState<string>('Action')
  const [msg, setMsg] = React.useState<string>('')

  async function reload() {
    setMsg('')
    const r = await listGenres()
    setList((r as any)?.data ?? r ?? [])
  }

  async function loadOne() {
    setMsg('')
    const r = await getGenre(id)
    setMsg('GET: ' + JSON.stringify(r))
  }

  async function createOne() {
    setMsg('')
    const r = await createGenre({ name })
    setMsg('CREATE: ' + JSON.stringify(r))
    await reload()
  }

  async function updateOne() {
    setMsg('')
    const r = await updateGenre(id, { name })
    setMsg('UPDATE: ' + JSON.stringify(r))
    await reload()
  }

  async function deleteOne() {
    setMsg('')
    const r = await deleteGenre(id)
    setMsg('DELETE: ' + JSON.stringify(r))
    await reload()
  }

  React.useEffect(() => { reload() }, [])

  return (
    <div className="p-6 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Genres Demo</h1>

      <div className="flex items-center gap-2">
        <input type="number" className="border px-2 py-1 rounded w-28"
               value={id} onChange={e=>setId(parseInt(e.target.value || '0'))} />
        <input className="border px-2 py-1 rounded"
               value={name} onChange={e=>setName(e.target.value)} placeholder="name"/>
        <button className="border px-2 py-1 rounded" onClick={reload}>List</button>
        <button className="border px-2 py-1 rounded" onClick={loadOne}>Get</button>
        <button className="border px-2 py-1 rounded" onClick={createOne}>Create</button>
        <button className="border px-2 py-1 rounded" onClick={updateOne}>Update</button>
        <button className="border px-2 py-1 rounded" onClick={deleteOne}>Delete</button>
      </div>

      {msg && <div className="text-green-700">{msg}</div>}

      <div>
        <div className="font-medium">Genres list</div>
        <pre className="bg-gray-50 border p-2 rounded">{JSON.stringify(list, null, 2)}</pre>
      </div>
    </div>
  )
}
