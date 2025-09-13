import { useEffect, useRef, useState } from 'react'
import { createMovieMultipart, updateMovieSmart, listGenres } from '../../features/movies'
import type { Movie, Genre } from '../../features/movies'

type Props = {
  movie?: Movie
  onClose: () => void
  onSuccess: () => void
}

export default function MovieFormModal({ movie, onClose, onSuccess }: Props) {
  const isEdit = !!movie

  // ── base fields
  const [title, setTitle] = useState(movie?.title ?? '')
  const [description, setDescription] = useState(movie?.description ?? '')
  const [releaseYear, setReleaseYear] = useState<number | ''>(movie?.release_year ?? '')
  const [durationMin, setDurationMin] = useState<number | ''>(movie?.duration_min ?? '')
  const [ageRating, setAgeRating] = useState<string>(movie?.age_rating ?? '')
  const [linkYtb, setLinkYtb] = useState<string>(movie?.link_ytb ?? '')

  // type/quality
  const initialType = ((movie as any)?.type ?? 'trailer') as 'trailer'|'full'
  const [type, setType] = useState<'trailer'|'full'>(initialType)
  const [quality, setQuality] = useState<string>((movie as any)?.quality ?? 'HD')

  // genres
  const [genres, setGenres] = useState<Genre[]>([])
  const [genreId, setGenreId] = useState<number | ''>((movie as any)?.genre_id ?? '')

  // files
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [movieFile, setMovieFile]   = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string>('')

  // esc to close
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  // load genres by name
  useEffect(() => {
    ;(async () => {
      try { setGenres(await listGenres()) } catch (e) { console.error(e) }
    })()
  }, [])

  // ensure value is exactly "trailer" or "full" (trim để tránh ký tự lạ)
  const onChangeType = (v: string) => setType((v.trim() as 'trailer'|'full'))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true); setMsg('')

    try {
      if (isEdit) {
        await updateMovieSmart(movie!.id, {
          title,
          description,
          release_year: releaseYear === '' ? undefined : Number(releaseYear),
          duration_min: durationMin === '' ? undefined : Number(durationMin),
          age_rating: ageRating || undefined,
          link_ytb: linkYtb || undefined,
          genre_id: genreId === '' ? undefined : Number(genreId),
          type,
          quality: quality ?? '',
          posterFile: posterFile || undefined,
          movieFile: type === 'full' ? (movieFile || undefined) : undefined,
        })
      } else {
        if (!posterFile) { setMsg('Vui lòng chọn poster (bắt buộc).'); setSubmitting(false); return }
        await createMovieMultipart({
          title,
          description: description || undefined,
          release_year: releaseYear === '' ? undefined : Number(releaseYear),
          duration_min: durationMin === '' ? undefined : Number(durationMin),
          age_rating: ageRating || undefined,
          link_ytb: linkYtb || undefined,
          genre_id: Number(genreId || 1),
          type,
          quality: quality ?? '',
          posterFile,
          movieFile: type === 'full' ? (movieFile ?? undefined) : undefined,
        })
      }
      onSuccess()
    } catch (e: any) {
      setMsg(e?.body?.message || e?.message || 'Lưu thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div ref={dialogRef} className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? 'Sửa phim' : 'Thêm phim'}</h2>
          <button className="rounded-lg border border-zinc-700 px-3 py-1 hover:bg-zinc-800" onClick={onClose}>Đóng</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Title */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Tiêu đề</span>
            <input className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                   value={title} onChange={e=>setTitle(e.target.value)} required />
          </label>

          {/* Release year */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Năm phát hành</span>
            <input type="number" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                   value={releaseYear} onChange={e=>setReleaseYear(e.target.value ? Number(e.target.value) : '')} />
          </label>

          {/* Description */}
          <label className="col-span-1 sm:col-span-2 flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Tóm tắt nội dung</span>
            <textarea className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 min-h-[90px]"
                      value={description} onChange={e=>setDescription(e.target.value)} />
          </label>

          {/* Duration */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Thời lượng (phút)</span>
            <input type="number" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                   value={durationMin} onChange={e=>setDurationMin(e.target.value ? Number(e.target.value) : '')} />
          </label>

          {/* Age rating (enum) */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Age rating</span>
            <select className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                    value={ageRating} onChange={e=>setAgeRating(e.target.value)} required>
              <option value="">-- chọn --</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
          </label>

          {/* YouTube */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">YouTube link</span>
            <input className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                   value={linkYtb ?? ''} onChange={e=>setLinkYtb(e.target.value)} />
          </label>

          {/* Genre (by name) */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Thể loại</span>
            <select className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                    value={genreId === '' ? '' : Number(genreId)}
                    onChange={e=>setGenreId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">-- chọn genre --</option>
              {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </label>

          {/* Type */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Type</span>
            <select className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                    value={type}
                    onChange={e=>onChangeType(e.target.value)}>
              <option value="trailer">trailer</option>
              <option value="full">full</option>
            </select>
          </label>

          {/* Quality */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Quality</span>
            <select className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                    value={quality} onChange={e=>setQuality(e.target.value)}>
              <option value="">-- (trống) --</option>
              <option value="SD">SD</option>
              <option value="HD">HD</option>
              <option value="FHD">FHD</option>
              <option value="UHD">UHD</option>
            </select>
          </label>

          {/* Poster */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Poster {isEdit ? '(tuỳ chọn)' : '(bắt buộc)'}</span>
            <input type="file" accept="image/*" onChange={e=>setPosterFile(e.target.files?.[0] ?? null)} />
          </label>

          {/* Movie file – LUÔN render, disable khi không phải full để tránh bị ẩn do style/caching */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Movie file (movie_url){isEdit ? ' (tuỳ chọn)' : ''}</span>
            <input
              type="file"
              accept="video/*"
              onChange={e=>setMovieFile(e.target.files?.[0] ?? null)}
              disabled={type !== 'full'}
              className={type !== 'full' ? 'opacity-50 cursor-not-allowed' : ''}
            />
            {type !== 'full' && <span className="text-xs text-zinc-500">Chỉ cần khi Type = full</span>}
          </label>

          {msg && <div className="col-span-1 sm:col-span-2 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">{msg}</div>}

          <div className="col-span-1 sm:col-span-2 mt-1 flex justify-end gap-2">
            <button type="button" onClick={onClose}
                    className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-800">Hủy</button>
            <button disabled={submitting}
                    className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500 disabled:opacity-50">
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
