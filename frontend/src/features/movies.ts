// src/features/movies.ts
import * as api from '../api/api_resource'
import { getApiV1Genres /* ... các api khác */ } from '../api/api_resource';

export type Genre = { id: number; name: string };

export async function listGenres(): Promise<Genre[]> {
  const res = await getApiV1Genres();
  return (res as any)?.data ?? (res as any) ?? [];
}
export type MediaAsset = {
  public_id: string
  movie_id: number
  type: 'trailer'|'full'|string
  quality: string | ''
  url: string
  created_at: string
}

export type Movie = {
  id: number
  title: string
  description?: string
  duration_min?: number
  release_year?: number
  poster_url?: string
  age_rating?: string
  avg_rating?: string
  views?: number
  link_ytb?: string | null
  public_id_poster?: string | null
  created_at?: string
  updated_at?: string
  mediaAsset?: MediaAsset[]
}

export async function listTop10() {
  return api.getApiV1MoviesTop10();
}
export async function listAll() {
  return api.getApiV1Movies();
}
export async function listByGenre(genre: string) {
  return api.getApiV1MoviesByGenre(genre);
}
export async function getById(id: number) {
  return api.getApiV1MoviesById(id);
}
export async function searchByKeyword(keyword: string) {
  return api.getApiV1MoviesSearchByKeyword(keyword);
}

export async function createMovieMultipart(params: {
  title: string
  description?: string
  duration_min?: number
  release_year?: number
  age_rating?: string
  link_ytb?: string
  genre_id: number
  type: 'trailer'|'full'
  quality?: string | ''        // có thể rỗng
  posterFile: File             // BẮT BUỘC
  movieFile?: File             // bắt buộc nếu type=full
}) {
  if (!params.posterFile) throw new Error('Vui lòng chọn poster');

  const fd = new FormData()
  fd.append('title', params.title)                             // ✅ chỉ 1 lần
  if (params.description)                fd.append('description', params.description)
  if (params.duration_min !== undefined) fd.append('duration_min', String(params.duration_min))
  if (params.release_year !== undefined) fd.append('release_year', String(params.release_year))
  if (params.age_rating)                 fd.append('age_rating', params.age_rating)
  if (params.link_ytb)                   fd.append('link_ytb', params.link_ytb)
  fd.append('genre_id', String(params.genre_id))
  fd.append('type', params.type)
  fd.append('quality', params.quality ?? '')                   // ✅ luôn gửi

  // Files — PHẢI kèm filename
  fd.append('poster_url', params.posterFile, params.posterFile.name)
  if (params.type === 'full') {
    if (!params.movieFile) throw new Error('type=full cần movie file')
    fd.append('movie_url', params.movieFile, params.movieFile.name)
  }

  try {
    // apiFetch PHẢI để native header cho FormData (không set Content-Type)
    return await api.postApiV1Movies(fd)
  } catch (e: any) {
    throw decorateUploadError(e)
  }
}

// ───────── UPDATE: JSON metadata (không thay file) ─────────
export async function updateMovieJson(id: number, body: Partial<{
  title: string
  description: string
  duration_min: number
  release_year: number
  age_rating: string
  link_ytb: string
  genre_id: number
  type: 'trailer'|'full'
  quality: string | ''
}>) {
  const cloned: any = { ...body }
  delete cloned.poster_url
  delete cloned.movie_url
  return api.putApiV1MoviesById(id, cloned)
}

// GIỮ nguyên createMovieMultipart như đã fix trước (append filename, quality luôn có)

// ✅ HÀM DUY NHẤT DÙNG CHO UPDATE
export async function updateMovieSmart(
  id: number,
  params: Partial<{
    title: string; description: string;
    duration_min: number; release_year: number;
    age_rating: string; link_ytb: string;
    genre_id: number; type: 'trailer'|'full';
    quality: string | '';
    posterFile: File; movieFile: File;
  }>
) {
  const hasFile = !!params.posterFile || !!params.movieFile;

  if (!hasFile) {
    // → JSON: tuyệt đối không gửi poster_url/movie_url
    const { posterFile, movieFile, ...json } = params as any;
    return api.putApiV1MoviesById(id, json);
  }

  // → MULTIPART: kèm filename & quality (kể cả "")
  const fd = new FormData();
  if (params.title !== undefined)         fd.append('title', params.title);
  if (params.description !== undefined)   fd.append('description', params.description);
  if (params.duration_min !== undefined)  fd.append('duration_min', String(params.duration_min));
  if (params.release_year !== undefined)  fd.append('release_year', String(params.release_year));
  if (params.age_rating !== undefined)    fd.append('age_rating', params.age_rating);
  if (params.link_ytb !== undefined)      fd.append('link_ytb', params.link_ytb);
  if (params.genre_id !== undefined)      fd.append('genre_id', String(params.genre_id));
  if (params.type !== undefined)          fd.append('type', params.type);
  if (params.quality !== undefined)       fd.append('quality', params.quality); // "" hợp lệ

  if (params.posterFile) fd.append('poster_url', params.posterFile, params.posterFile.name);
  if (params.movieFile)  fd.append('movie_url',  params.movieFile,  params.movieFile.name);

  return api.putApiV1MoviesById(id, fd);
}


function decorateUploadError(e: any) {
  const msg = e?.message || ''
  const hints = [
    'Kiểm tra field name: phải là poster_url / movie_url.',
    'Đảm bảo append kèm filename (fd.append(name, file, file.name)).',
    'Khi gửi multipart, đừng set Content-Type thủ công.',
    'Nếu gửi file khi UPDATE, nhớ kèm type & quality (có thể "" cũng được).',
  ]
  return new Error(`${msg || 'Upload failed'}. Hint: ${hints.join(' ')}`)
}

export async function remove(id: number) {
  return api.deleteApiV1MoviesById(id);
}

export const createMovie = createMovieMultipart
export const updateMovieMetadata = updateMovieJson