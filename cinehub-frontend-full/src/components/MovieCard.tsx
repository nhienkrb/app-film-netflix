import { Movie } from '@/types/Movie'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Heart } from 'lucide-react'
import { useFavorites } from '@/state/FavoritesContext'
import RatingStars from './RatingStars'

export default function MovieCard({ movie }:{ movie:Movie }){
  const { has, toggle } = useFavorites()
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="relative group">
      <Link to={`/movie/${movie.id}`} className="block rounded-2xl overflow-hidden shadow-card">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-[260px] md:h-[320px] object-cover" loading="lazy"/>
      </Link>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
        <Link to={`/watch/${movie.id}`} className="button button-primary px-3 py-1.5 text-sm"><Play className="w-4 h-4"/> Xem nhanh</Link>
        <button onClick={()=>toggle(movie.id)} className="button button-outline px-3 py-1.5 text-sm">
          <Heart className={`w-4 h-4 ${has(movie.id) ? 'text-primary fill-primary' : ''}`}/> Yêu thích
        </button>
      </div>
      <div className="mt-2">
        <div className="text-sm font-semibold line-clamp-1">{movie.title}</div>
        <div className="text-xs text-muted flex items-center gap-2"><span>{movie.releaseYear}</span><span>•</span><span>{movie.ageRating}</span></div>
        <RatingStars value={movie.rating}/>
      </div>
    </motion.div>
  )
}
