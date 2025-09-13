// src/pages/ViewHistoryDemo.tsx
import React from 'react'
import * as vh from '../features/viewHistory'

export default function ViewHistoryDemo() {
  const [movieId, setMovieId] = React.useState<number>(8)
  const [position, setPosition] = React.useState<number>(9)

  const [list, setList] = React.useState<any>(null)
  const [msg, setMsg] = React.useState<string>('')

  async function load() {
    setMsg('')
    try {
      const r = await vh.listMyHistory()
      setList(r)
    } catch (e:any) {
      setMsg(`LOAD ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function save() {
    setMsg('')
    try {
      const r = await vh.upsertPosition(movieId, position)
      setMsg('POST: ' + JSON.stringify(r, null, 2))
      await load()
    } catch (e:any) {
      setMsg(`POST ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  async function remove() {
    setMsg('')
    try {
      const r = await vh.removeByMovie(movieId)
      setMsg('DELETE: ' + JSON.stringify(r, null, 2))
      await load()
    } catch (e:any) {
      setMsg(`DELETE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  React.useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">View History Demo</h1>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="font-medium">Params</div>
          <input
            className="border px-3 py-2 rounded w-full"
            type="number"
            value={movieId}
            onChange={e=>setMovieId(parseInt(e.target.value||'0'))}
            placeholder="movieId"
          />
          <input
            className="border px-3 py-2 rounded w-full"
            type="number"
            value={position}
            onChange={e=>setPosition(parseInt(e.target.value||'0'))}
            placeholder="position_sec"
          />
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={save}>Add/Update</button>
            <button className="border px-3 py-2 rounded" onClick={remove}>Delete</button>
            <button className="border px-3 py-2 rounded" onClick={load}>Reload</button>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Server response</div>
          {msg && <pre className="bg-green-50 border border-green-200 rounded p-2 whitespace-pre-wrap">{msg}</pre>}
          <div className="font-medium mt-3">My View History</div>
          <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
            {JSON.stringify(list, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
