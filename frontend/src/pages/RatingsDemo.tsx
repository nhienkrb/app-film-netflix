// src/pages/RatingsDemo.tsx
import React from 'react'
import * as ratings from '../features/ratings'

export default function RatingsDemo() {
  const [movieId, setMovieId] = React.useState<number>(8)
  const [stars, setStars] = React.useState<number>(4)
  const [comment, setComment] = React.useState<string>('Great movie!')

  const [list, setList] = React.useState<any>(null)
  const [msg, setMsg] = React.useState<string>('')

  async function load() {
    setMsg('')
    const r = await ratings.listByMovie(movieId)
    setList(r)
  }
  async function add() {
    setMsg('')
    try {
      const r = await ratings.createRating({ movie_id: movieId, stars, comment })
      setMsg('POST: ' + JSON.stringify(r, null, 2))
      await load()
    } catch (e: any) {
      setMsg(`POST ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }
  async function update() {
    setMsg('')
    try {
      const r = await ratings.updateRating({ movie_id: movieId, stars, comment })
      setMsg('PUT: ' + JSON.stringify(r, null, 2))
      await load()
    } catch (e: any) {
      setMsg(`PUT ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }
  async function remove() {
    setMsg('')
    try {
      const r = await ratings.deleteRating(movieId)
      setMsg('DELETE: ' + JSON.stringify(r, null, 2))
      await load()
    } catch (e: any) {
      setMsg(`DELETE ERR: ${e.status || ''} ${e.message || ''}\n${JSON.stringify(e.body || {}, null, 2)}`)
    }
  }

  React.useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Ratings Demo</h1>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="font-medium">Params</div>
          <input type="number" className="border px-3 py-2 rounded w-full"
                 value={movieId} onChange={e=>setMovieId(parseInt(e.target.value||'0'))} placeholder="movie_id" />
          <select className="border px-3 py-2 rounded w-full"
                  value={stars} onChange={e=>setStars(parseInt(e.target.value))}>
            {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} ★</option>)}
          </select>
          <textarea className="border px-3 py-2 rounded w-full"
                    value={comment} onChange={e=>setComment(e.target.value)} placeholder="comment (optional)"/>
          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={add}>Add</button>
            <button className="border px-3 py-2 rounded" onClick={update}>Update</button>
            <button className="border px-3 py-2 rounded" onClick={remove}>Delete</button>
          </div>
          <button className="border px-3 py-2 rounded" onClick={load}>Reload</button>
        </div>

        <div>
          <div className="font-medium mb-1">Server response</div>
          {msg && <pre className="bg-green-50 border p-2 rounded whitespace-pre-wrap">{msg}</pre>}
          <div className="font-medium mt-3">Ratings of movie #{movieId}</div>
          <pre className="bg-gray-50 border p-2 rounded whitespace-pre-wrap">
            {JSON.stringify(list, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
