import { Link } from 'react-router-dom'

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="card card-hover overflow-hidden rounded-xl"
      title={movie.title}
    >
      <div className="aspect-poster aspect-fill">
        <img src={movie.poster_url} alt={movie.title} />
      </div>
      <div className="card-body">
        <div className="font-medium clamp-2">{movie.title}</div>
        {movie.release_year && (
          <div className="text-xs text-zinc-400 mt-1">{movie.release_year}</div>
        )}
      </div>
    </Link>
  )
}
