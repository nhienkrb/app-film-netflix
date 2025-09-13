// src/pages/FavoritesDemo.tsx
import React from 'react'
import * as favorites from '../features/favorites'

// Demo: thay userId / movieId theo dữ liệu của bạn
const DEFAULT_USER_ID = 8
const DEFAULT_MOVIE_ID = 8

export default function FavoritesDemo() {
  const [userId, setUserId] = React.useState<number>(DEFAULT_USER_ID)
  const [movieId, setMovieId] = React.useState<number>(DEFAULT_MOVIE_ID)
  const [list, setList] = React.useState<any[]>([])
  const [check, setCheck] = React.useState<any>(null)
  const [msg, setMsg] = React.useState<string>('')

  async function reload() {
    setMsg('')
    const r = await favorites.getFavoritesByUser(userId)
    setList(r?.data || [])
  }
  async function doCheck() {
    setMsg('')
    const r = await favorites.checkFavorite({ userId, movieId })
    setCheck(r)
  }
  async function add() {
    setMsg('')
    const r = await favorites.addFavorite({ userId, movieId })
    setMsg('Added: ' + JSON.stringify(r?.data))
    await reload()
  }
  async function remove() {
    setMsg('')
    const r = await favorites.removeFavorite({ userId, movieId })
    setMsg(r?.message || 'Removed')
    await reload()
  }

  React.useEffect(() => { reload() }, [])

  return (
    <div className="p-6 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Favorites Demo</h1>

      <div className="flex items-center gap-2">
        <input type="number" className="border px-2 py-1 rounded w-28"
               value={userId} onChange={e=>setUserId(parseInt(e.target.value||'0'))}/>
        <input type="number" className="border px-2 py-1 rounded w-28"
               value={movieId} onChange={e=>setMovieId(parseInt(e.target.value||'0'))}/>
        <button className="border px-2 py-1 rounded" onClick={reload}>Reload</button>
        <button className="border px-2 py-1 rounded" onClick={doCheck}>Check</button>
        <button className="border px-2 py-1 rounded" onClick={add}>Add</button>
        <button className="border px-2 py-1 rounded" onClick={remove}>Remove</button>
      </div>

      {msg && <div className="text-green-700">{msg}</div>}

      <div>
        <div className="font-medium">Check result</div>
        <pre className="bg-gray-50 border p-2 rounded">{JSON.stringify(check, null, 2)}</pre>
      </div>

      <div>
        <div className="font-medium">Favorites of user #{userId}</div>
        <pre className="bg-gray-50 border p-2 rounded">{JSON.stringify(list, null, 2)}</pre>
      </div>
    </div>
  )
}
