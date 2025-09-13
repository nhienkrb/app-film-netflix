import { useEffect, useState } from 'react'
import api from '../api'

// Components
import HeroVideoCarousel from '../components/HeroVideoCarousel'
import RowCarousel from '../components/RowCarousel'

export default function Home() {
  const [top10, setTop10] = useState<any[]>([])
  const [allMovies, setAllMovies] = useState<any[]>([])

  useEffect(() => {
    // Fetch top 10
    api.getApiV1MoviesTop10()
      .then(res => setTop10(res.data || res))
      .catch(console.error)

    // Fetch all
    api.getApiV1Movies()
      .then(res => setAllMovies(res.data || res))
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero slider */}
      <HeroVideoCarousel movies={top10} />

      {/* Row carousels */}
      <section className="space-y-8">
        <RowCarousel title="Đang thịnh hành" movies={allMovies} />
        <RowCarousel title="Top 10 phim" movies={top10} />
      </section>
    </div>
  )
}
