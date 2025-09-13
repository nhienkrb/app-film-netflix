import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Movie = {
  id: number
  title: string
  poster_url?: string
  link_ytb?: string | null
}

const AUTOPLAY_MS = 7000 // 7s/slide

function getYouTubeId(url?: string | null) {
  if (!url) return null
  try {
    // hỗ trợ dạng watch?v=, youtu.be/, shorts/
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    const parts = u.pathname.split('/')
    const last = parts.pop() || parts.pop()
    return last || null
  } catch {
    return null
  }
}

export default function HeroVideoCarousel({ movies = [] as Movie[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<number | null>(null)
  const hoveringRef = useRef(false)

  const movie = movies[current]
  const ytId = useMemo(() => getYouTubeId(movie?.link_ytb), [movie])

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % Math.max(movies.length, 1)),
    [movies.length]
  )
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + Math.max(movies.length, 1)) % Math.max(movies.length, 1)),
    [movies.length]
  )

  // Auto rotate
  useEffect(() => {
    if (!movies.length) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (!hoveringRef.current) next()
    }, AUTOPLAY_MS)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [current, movies.length, next])

  if (!movie) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      onMouseEnter={() => (hoveringRef.current = true)}
      onMouseLeave={() => (hoveringRef.current = false)}
    >
      {/* Khung 21:9 */}
      <div className="relative w-full aspect-[21/9] bg-black">
        {/* Video trailer (YouTube) */}
        {ytId ? (
          <iframe
            key={ytId}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none" // không chắn overlay
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&loop=1&playlist=${ytId}`}
            title={movie.title}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
          />
        ) : (
          // fallback: poster
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        )}

        {/* Overlay gradient + nội dung */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="pointer-events-auto absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow mb-4 line-clamp-2">
            {movie.title}
          </h2>
          <div className="flex gap-3">
            <Link
              to={`/watch/${movie.id}`}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm font-medium"
            >
              Xem ngay
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-zinc-700/90 hover:bg-zinc-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 backdrop-blur px-3 py-2 rounded-full text-white"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 backdrop-blur px-3 py-2 rounded-full text-white"
            aria-label="Next"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {movies.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 w-6 rounded-full cursor-pointer transition ${
                  i === current ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
