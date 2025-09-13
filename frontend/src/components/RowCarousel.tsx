import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Movie = {
  id: number
  title: string
  poster_url?: string
}

export default function RowCarousel({ title, movies = [] as Movie[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const cardW = 192 // px (w-48)

  // update arrow states
  const updateBtns = () => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanLeft(scrollLeft > 2)
    setCanRight(scrollLeft + clientWidth < scrollWidth - 2)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    updateBtns()
    const onScroll = () => updateBtns()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(updateBtns)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect() }
  }, [])

  // wheel: chuyển dọc -> ngang
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' })
        e.preventDefault()
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const scrollByCards = (n: number) => {
    const el = ref.current
    if (!el) return
    const step = Math.floor(el.clientWidth / cardW) * cardW || cardW * 2
    el.scrollBy({ left: n * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Link to="/search" className="text-sm text-red-500 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {/* edge gradients */}
      <div className="pointer-events-none absolute left-0 top-12 bottom-0 w-10 bg-gradient-to-r from-black to-transparent rounded-l-xl" />
      <div className="pointer-events-none absolute right-0 top-12 bottom-0 w-10 bg-gradient-to-l from-black to-transparent rounded-r-xl" />

      {/* List */}
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-2 px-2 scroll-smooth snap-x snap-mandatory scrollbar-hide"
          style={{ scrollPaddingInline: 8 }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') scrollByCards(1)
            if (e.key === 'ArrowLeft') scrollByCards(-1)
          }}
        >
          {movies.map((m) => (
            <Link
              key={m.id}
              to={`/movie/${m.id}`}
              className="flex-none w-48 snap-start bg-zinc-900 rounded-lg overflow-hidden hover:scale-[1.02] transition"
              title={m.title}
            >
              <div className="w-full aspect-[2/3] bg-zinc-800">
                <img
                  src={m.poster_url}
                  alt={m.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2 text-sm line-clamp-2">{m.title}</div>
            </Link>
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollByCards(-1)}
          disabled={!canLeft}
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur p-2 disabled:opacity-40"
        >
          ‹
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => scrollByCards(1)}
          disabled={!canRight}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur p-2 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  )
}
