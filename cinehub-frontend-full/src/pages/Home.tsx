import { MOVIES } from '@/data/movies'
import CarouselRow from '@/components/CarouselRow'
import MovieCard from '@/components/MovieCard'

export default function Home(){
  const newest=[...MOVIES].sort((a,b)=>b.releaseYear-a.releaseYear)
  const trending=[...MOVIES].sort((a,b)=>b.rating-a.rating).slice(0,8)
  const scifi=MOVIES.filter(m=>m.genres.includes('Sci-Fi'))
  const drama=MOVIES.filter(m=>m.genres.includes('Drama'))
  return (
    <div className="space-y-6">
      <Hero/>
      <CarouselRow title="Mới cập nhật">{newest.map(m=><div key={m.id} className="w-[180px] shrink-0 snap-start"><MovieCard movie={m}/></div>)}</CarouselRow>
      <CarouselRow title="Đang thịnh hành">{trending.map(m=><div key={m.id} className="w-[180px] shrink-0 snap-start"><MovieCard movie={m}/></div>)}</CarouselRow>
      <CarouselRow title="Khoa học viễn tưởng">{scifi.map(m=><div key={m.id} className="w-[180px] shrink-0 snap-start"><MovieCard movie={m}/></div>)}</CarouselRow>
      <CarouselRow title="Tâm lý">{drama.map(m=><div key={m.id} className="w-[180px] shrink-0 snap-start"><MovieCard movie={m}/></div>)}</CarouselRow>
    </div>
  )
}
function Hero(){ const pick=MOVIES[0]; return (
  <section className="relative h-[46vh] md:h-[56vh] overflow-hidden mb-4">
    <img src={pick.backdropUrl} alt={pick.title} className="absolute inset-0 w-full h-full object-cover"/>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
    <div className="container relative z-10 pt-16 md:pt-24">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-3">{pick.title}</h1>
      <p className="max-w-2xl text-sm md:text-base opacity-90 mb-4">{pick.description}</p>
      <div className="flex gap-3"><a href={`/watch/${pick.id}`} className="button button-primary">Xem ngay</a><a href={`/movie/${pick.id}`} className="button button-outline">Xem chi tiết</a></div>
    </div>
  </section>
)}
