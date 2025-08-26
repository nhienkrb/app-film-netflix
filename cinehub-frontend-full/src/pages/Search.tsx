import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MOVIES } from '@/data/movies'
import MovieCard from '@/components/MovieCard'

export default function Search(){
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const results = useMemo(()=>{
    if(!q) return []
    return MOVIES.filter(m => m.title.toLowerCase().includes(q) || m.genres.some(g=>g.toLowerCase().includes(q)) || String(m.releaseYear).includes(q))
  },[q])
  return (
    <div className="container py-6">
      <h1 className="text-xl font-semibold mb-4">Kết quả cho: <span className="text-primary">{q || '(rỗng)'}</span></h1>
      {results.length===0 ? (<div className="opacity-80">Không tìm thấy phim phù hợp.</div>) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{results.map(m=><MovieCard key={m.id} movie={m}/>)}</div>
      )}
    </div>
  )
}
