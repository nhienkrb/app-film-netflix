// src/pages/MovieDetail.tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { getSession } from '../lib/auth'
import * as fav from '../features/favorites'
import * as ratings from '../features/ratings'
import StarInput from '../components/ui/StarInput'

type Movie = {
  id: number
  title: string
  description?: string
  release_year?: number
  duration_min?: number
  age_rating?: string
  poster_url?: string
  link_ytb?: string | null
  mediaAsset?: { type: string; url: string; quality?: string }[]
}

function fmtDuration(min?: number) {
  if (!min) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

export default function MovieDetail() {
  const { id } = useParams()
  const movieId = Number(id)
  const nav = useNavigate()
  const { isAuthenticated, payload } = getSession()
  const myUserId = (payload?.id as number | undefined) || undefined

  const [movie, setMovie] = React.useState<Movie | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState<string | null>(null)

  // Ratings
  const [list, setList] = React.useState<ratings.Rating[]>([])
  const [avg, setAvg] = React.useState<number>(0)
  const [count, setCount] = React.useState<number>(0)

  // “Đánh giá của tôi”
  const mine = React.useMemo(
    () => list.find((r) => r.user_id === myUserId),
    [list, myUserId]
  )
  const [myStars, setMyStars] = React.useState<number>(mine?.stars || 0)
  const [myComment, setMyComment] = React.useState<string>(mine?.comment || '')

  // yêu thích
  const [favBusy, setFavBusy] = React.useState(false)
  const [isFav, setIsFav] = React.useState<boolean>(false)

  async function loadMovie() {
    setErr(null)
    setLoading(true)
    try {
      const r = await api.getApiV1MoviesById(movieId)
      setMovie(r?.data ?? r)
    } catch (e: any) {
      setErr(e?.body?.message || 'Không tải được phim')
    } finally {
      setLoading(false)
    }
  }

  async function loadRatings() {
    try {
      const r = await ratings.listByMovie(movieId)
      const arr = (r?.data ?? r) as ratings.Rating[] || []
      setList(arr)
      const n = arr.length
      setCount(n)
      setAvg(n ? Math.round((arr.reduce((s, x) => s + (x.stars || 0), 0) / n) * 10) / 10 : 0)
      // sync form của tôi
      const me = arr.find((x) => x.user_id === myUserId)
      setMyStars(me?.stars || 0)
      setMyComment(me?.comment || '')
    } catch (e) {
      // yên lặng cho phần ratings
    }
  }

  async function loadFavoriteFlag() {
    if (!myUserId) return
    try {
      const r = await api.getApiV1FavoritesCheck({ userId: myUserId, movieId })
      setIsFav(!!r?.isFavorite)
    } catch {}
  }

  React.useEffect(() => {
    if (!movieId) return
    loadMovie()
    loadRatings()
    loadFavoriteFlag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, myUserId])

  // === Rating actions (đơn giản – đúng API) ===
  async function submitMyRating() {
    if (!isAuthenticated) return nav('/login', { replace: true })
    if (!myStars || myStars < 1) return alert('Chọn số sao (1–5)')

    try {
      if (mine) {
        await ratings.updateRating({ movie_id: movieId, stars: myStars, comment: myComment || null })
      } else {
        await ratings.createRating({ movie_id: movieId, stars: myStars, comment: myComment || null })
      }
      await loadRatings()
    } catch (e: any) {
      alert(e?.body?.message || 'Gửi đánh giá thất bại')
    }
  }

  async function removeMyRating() {
    if (!isAuthenticated) return nav('/login', { replace: true })
    try {
      await ratings.deleteRating(movieId)
      await loadRatings()
    } catch (e: any) {
      alert(e?.body?.message || 'Xoá đánh giá thất bại')
    }
  }

  // === Favorite actions ===
  async function toggleFavorite() {
    if (!isAuthenticated) return nav('/login', { replace: true })
    if (!myUserId) return
    setFavBusy(true)
    try {
      if (isFav) {
        await fav.removeFavorite({ userId: myUserId, movieId })
      } else {
        await fav.addFavorite({ userId: myUserId, movieId })
      }
      await loadFavoriteFlag()
    } catch (e: any) {
      alert(e?.body?.message || 'Cập nhật yêu thích thất bại')
    } finally {
      setFavBusy(false)
    }
  }

  if (loading) return <div className="p-6">Đang tải…</div>
  if (err) return <div className="p-6 text-red-400">{err}</div>
  if (!movie) return <div className="p-6">Không tìm thấy phim.</div>

  const trailer = movie.mediaAsset?.find((m) => m.type === 'trailer')?.url || movie.link_ytb || ''

  return (
    <div className="space-y-6 px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="text-sm text-zinc-400">
              {movie.release_year || '—'} • {fmtDuration(movie.duration_min)} • {movie.age_rating || '—'}
            </div>

            <div className="flex items-center gap-3">
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
                onClick={() => nav(`/watch/${movie.id}`)}
              >Xem ngay</button>

              <button
                disabled={favBusy}
                onClick={toggleFavorite}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
              >
                {isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
              </button>

              <div className="ml-auto text-sm text-zinc-400">
                {avg.toFixed(1)} / 5 • {count} lượt
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-black/20">
            {trailer ? (
              <iframe
                className="aspect-video w-full rounded-lg"
                src={trailer.includes('youtube.com') ? trailer.replace('watch?v=', 'embed/') : trailer}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                className="aspect-video w-full rounded-lg object-cover"
                src={movie.poster_url || '/placeholder.png'}
                alt={movie.title}
              />
            )}
          </div>
        </div>
      </section>

      {/* Tóm tắt */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Tóm tắt</h2>
          <p className="whitespace-pre-wrap text-zinc-300">{movie.description || '—'}</p>
        </div>

        {/* Form đánh giá của tôi */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-3 text-lg font-semibold">
            {mine ? 'Sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
          </h2>

          <div className="mb-3">
            <div className="mb-1 text-sm text-zinc-400">Điểm</div>
            <StarInput value={myStars} onChange={setMyStars} />
          </div>

          <textarea
            className="mb-3 h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950/50 p-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Chia sẻ cảm nhận của bạn… (tuỳ chọn)"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={submitMyRating}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
            >
              {mine ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>

            {mine && (
              <button
                onClick={removeMyRating}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
              >
                Xoá đánh giá
              </button>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => nav('/login')}
                className="ml-auto rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
              >
                Đăng nhập để đánh giá
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Danh sách đánh giá */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Đánh giá</h2>
          <div className="text-sm text-zinc-400">{avg.toFixed(1)} / 5 • {count} lượt</div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-700 p-6 text-sm text-zinc-400">
            Chưa có đánh giá.
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                <div className="flex items-center justify-between">
                  <StarInput value={r.stars} readOnly size="sm" />
                  <span className="text-xs text-zinc-500">{new Date(r.createdAt || Date.now()).toLocaleString('vi-VN')}</span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-zinc-300">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
