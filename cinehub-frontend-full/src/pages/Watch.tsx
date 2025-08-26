import { useParams } from 'react-router-dom'
import { MOVIES } from '@/data/movies'
import VideoPlayer from '@/components/VideoPlayer'

export default function Watch(){
  const { id } = useParams()
  const movie = MOVIES.find(m=>m.id===Number(id))
  if(!movie) return <div className="container py-10">Không tìm thấy phim</div>
  return (
    <div className="container py-6 space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">{movie.title}</h1>
      <VideoPlayer movieId={movie.id} src={movie.videoUrl}/>
      <p className="opacity-80 max-w-3xl">{movie.description}</p>
    </div>
  )
}
