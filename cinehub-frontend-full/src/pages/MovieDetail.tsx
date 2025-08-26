import { useParams, Link } from 'react-router-dom'
import { MOVIES } from '@/data/movies'
import GenreBadge from '@/components/GenreBadge'
import RatingStars from '@/components/RatingStars'
import MovieCard from '@/components/MovieCard'

export default function MovieDetail(){
  const { id } = useParams()
  const movie = MOVIES.find(m=>m.id===Number(id))
  if(!movie) return <div className="container py-10">Không tìm thấy phim</div>
  const related = MOVIES.filter(m=>m.id!==movie.id && m.genres.some(g=>movie.genres.includes(g))).slice(0,8)
  return (
    <div>
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={movie.backdropUrl} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="container relative z-10 pt-12 md:pt-24">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{movie.title}</h1>
          <div className="flex items-center gap-3 text-sm opacity-90 mb-2"><span>{movie.releaseYear}</span><span>•</span><span>{movie.ageRating}</span><RatingStars value={movie.rating}/></div>
          <p className="max-w-3xl opacity-90 mb-4">{movie.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">{movie.genres.map(g=><GenreBadge key={g} name={g}/>)}</div>
          <div className="flex gap-3"><Link to={`/watch/${movie.id}`} className="button button-primary">Xem phim</Link><a href={movie.trailerUrl} className="button button-outline" target="_blank">Trailer</a></div>
        </div>
      </section>
      <section className="container my-6"><h2 className="text-xl font-semibold mb-3">Có thể bạn sẽ thích</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{related.map(m=><MovieCard key={m.id} movie={m}/>)}</div>
      </section>
    </div>
  )
}
