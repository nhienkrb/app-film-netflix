import { useFavorites } from '@/state/FavoritesContext'
import { MOVIES } from '@/data/movies'
import MovieCard from '@/components/MovieCard'

export default function Favorites(){
  const { favorites } = useFavorites()
  const items = MOVIES.filter(m => favorites.includes(m.id))
  return (
    <div className="container py-6">
      <h1 className="text-xl font-semibold mb-4">Yêu thích của bạn</h1>
      {items.length===0 ? <div className="opacity-80">Chưa có phim nào trong danh sách.</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{items.map(m=><MovieCard key={m.id} movie={m}/>)}</div>
      )}
    </div>
  )
}
