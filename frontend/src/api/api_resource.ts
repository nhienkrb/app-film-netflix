//import { apiFetch } from '../lib/fetcher';
import { getToken } from '../lib/auth';
// src/api/api_resource.ts
export type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS';

export interface ApiFetchOptions<TBody=any> {
  method?: HttpMethod;
  path: string;
  query?: Record<string, any>;
  body?: TBody;
  headers?: Record<string, string>;
  token?: string;
  signal?: AbortSignal;
  baseURL?: string;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT = 30_000;

const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL
  || (typeof window !== 'undefined' && /^localhost|127\.0\.0\.1$/.test(window.location.hostname)
      ? `http://${window.location.hostname}:5000`
      : '');

function isFormData(v: any): v is FormData {
  return typeof FormData !== 'undefined' && v instanceof FormData;
}

function buildUrl(base: string, path: string, query?: Record<string, any>) {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, base || window.location.origin);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v == null) return;
      if (Array.isArray(v)) v.forEach(x => url.searchParams.append(k, String(x)));
      else url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

function getTokenSafe(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}

async function safeJson(resp: Response) {
  try {
    const t = await resp.text();
    return t ? JSON.parse(t) : undefined;
  } catch { return undefined; }
}

export async function apiFetch<T=any>({
  method='GET', path, query, body, headers={}, token, signal,
  baseURL=API_BASE, timeoutMs=DEFAULT_TIMEOUT
}: ApiFetchOptions): Promise<T> {
  const url = buildUrl(baseURL, path, query);
  const isFD = isFormData(body);

  const finalHeaders: Record<string, string> = { Accept: '*/*', ...headers };
  if (!isFD && body !== undefined && method !== 'GET' && method !== 'HEAD') {
    if (!finalHeaders['Content-Type']) finalHeaders['Content-Type'] = 'application/json';
  }

  const jwt = token || getTokenSafe();
  if (jwt) finalHeaders['Authorization'] = `Bearer ${jwt}`;

  const controller = new AbortController();
  const tmr = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(url, {
      method,
      headers: finalHeaders,
      body: isFD ? body as any : (body !== undefined ? JSON.stringify(body) : undefined),
      signal: signal || controller.signal,
      credentials: 'include',
    });
    clearTimeout(tmr);

    if (resp.status === 204) return undefined as unknown as T;

    const ctype = resp.headers.get('content-type') || '';
    const data = ctype.includes('application/json') ? await safeJson(resp) : await resp.text();

    if (!resp.ok) {
      const hints: string[] = [];
      if ([400, 413, 422].includes(resp.status)) {
        hints.push(
          'Field name đúng: poster_url / movie_url.',
          'Append kèm filename: fd.append(name, file, file.name).',
          'Multipart KHÔNG set Content-Type.',
          'Update có file → kèm type & quality (có thể "" cũng được).'
        );
      }
      const msg = (typeof data === 'object' ? (data?.message || data?.error) : undefined) || `[${resp.status}] ${resp.statusText}`;
      const err: any = new Error(hints.length ? `${msg} | Hint: ${hints.join(' ')}` : msg);
      err.status = resp.status; err.body = data; err.url = url;
      throw err;
    }
    return data as T;
  } catch (e: any) {
    clearTimeout(tmr);
    if (e?.name === 'AbortError') {
      const er: any = new Error(`Request timeout ${Math.round(timeoutMs/1000)}s`);
      er.code = 'ETIMEOUT'; er.url = url; throw er;
    }
    if (e?.message?.includes('Failed to fetch')) {
      const er: any = new Error('Không kết nối được server (CORS/Network?)');
      er.code = 'ENETWORK'; er.cause = e; er.url = url; throw er;
    }
    throw e;
  }
}

// Auto-generated thin wrappers. Adjust types as needed.
export async function postApiV1AuthLogin(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/auth/login`,
    query,
    body: body,
    token
  });
}

export async function postApiV1AuthRegister(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/auth/register`,
    query,
    body: body,
    token
  });
}

export async function deleteApiV1Favorites(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/favorites`,     // bỏ "/" cuối
    query,
    body,
    token: authToken               // dùng authToken để gắn Authorization
  });
}

export async function postApiV1Favorites(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/favorites`,     // bỏ "/" cuối
    query,
    body,
    token: authToken               // dùng authToken
  });
}

export async function getApiV1FavoritesCheck(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/favorites/check`,
    query,
    body: undefined,
    token: authToken               // dùng authToken
  });
}

export async function getApiV1FavoritesUserByUserid(userId: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/favorites/user/${userId}`,
    query,
    body: undefined,
    token: authToken               // dùng authToken
  });
}


// ───────────────────── GENRES ─────────────────────

export async function getApiV1Genres(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/genres`,    // bỏ dấu "/" cuối
    query,
    body: undefined,
    token: authToken           // dùng authToken để gắn Authorization
  });
}

export async function postApiV1Genres(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/genres`,    // bỏ dấu "/" cuối
    query,
    body: body,
    token: authToken
  });
}

export async function getApiV1GenresById(id: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/genres/${id}`,
    query,
    body: undefined,
    token: authToken
  });
}

export async function putApiV1GenresById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/genres/${id}`,
    query,
    body: body,
    token: authToken
  });
}

export async function deleteApiV1GenresById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/genres/${id}`,
    query,
    // body không cần cho DELETE id; giữ nguyên nếu backend chấp nhận, còn tốt nhất để undefined:
    body: body ?? undefined,
    token: authToken
  });
}


// ───────────────────── PLANS ─────────────────────

export async function getApiV1Plans(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/plans`,    // bỏ '/' cuối
    query,
    body: undefined,
    token: authToken          // dùng authToken để gắn Authorization
  });
}

export async function postApiV1Plans(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/plans`,    // bỏ '/' cuối
    query,
    body,
    token: authToken
  });
}

export async function getApiV1PlansById(id: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/plans/${id}`,
    query,
    body: undefined,
    token: authToken
  });
}

export async function putApiV1PlansById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/plans/${id}`,
    query,
    body,
    token: authToken
  });
}

export async function deleteApiV1PlansById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/plans/${id}`,
    query,
    body: body ?? undefined, // thường không cần body cho DELETE by id
    token: authToken
  });
}


// ───────────────────── STATISTICAL ─────────────────────

/** GET /api/v1/statistical/revenue  (JWT) */
export async function getApiV1StatisticalRevenue(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/statistical/revenue`,
    query,
    body: undefined,
    token: authToken
  });
}

/** GET /api/v1/statistical/revenue/monthly/:year  (JWT) */
export async function getApiV1StatisticalRevenueMonthlyByYear(
  year: string | number,
  query?: Record<string, any>,
  token?: string
) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/statistical/revenue/monthly/${year}`,
    query,
    body: undefined,
    token: authToken
  });
}

/** GET /api/v1/statistical/revenue/top-rated  (JWT) */
export async function getApiV1StatisticalRevenueTopRated(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/statistical/revenue/top-rated`,
    query,
    body: undefined,
    token: authToken
  });
}


// ───────────────────── SUBSCRIPTIONS ─────────────────────

export async function getApiV1Subscriptions(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/subscriptions`,   // bỏ "/" cuối
    query,
    body: undefined,
    token: authToken                 // PHẢI dùng authToken để gắn Authorization
  });
}

export async function postApiV1Subscriptions(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/subscriptions`,   // bỏ "/" cuối
    query,
    body,
    token: authToken
  });
}

export async function getApiV1SubscriptionsById(id: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/subscriptions/${id}`,
    query,
    body: undefined,
    token: authToken
  });
}

export async function putApiV1SubscriptionsById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/subscriptions/${id}`,
    query,
    body,
    token: authToken
  });
}

export async function deleteApiV1SubscriptionsById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/subscriptions/${id}`,
    query,
    body: body ?? undefined,  // thường không cần body cho DELETE by id
    token: authToken
  });
}


// ───────────────────── VIEW HISTORY ─────────────────────

/** GET /api/v1/view-history  (JWT) – lấy lịch sử xem của user (từ token) */
export async function getApiV1ViewHistory(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'GET',
    path: `/api/v1/view-history`,
    query,
    body: undefined,
    token: authToken
  })
}

/** POST /api/v1/view-history  (JWT) – tạo/cập nhật vị trí xem
 *  body: { movieId: number, position_sec: number }
 */
export async function postApiV1ViewHistory(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'POST',
    path: `/api/v1/view-history`,
    query,
    body,
    token: authToken
  })
}

/** DELETE /api/v1/view-history/:movieId  (JWT) – xoá lịch sử 1 phim */
export async function deleteApiV1ViewHistoryByMovieid(movieId: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/view-history/${movieId}`,
    query,
    body: undefined,
    token: authToken
  })
}

// ───────────────────── MOVIES ─────────────────────
// GET /api/v1/movies/top10   (public theo curl bạn cung cấp)
export async function getApiV1MoviesTop10(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/movies/top10`,
    query,
    body: undefined,
    token: authToken
  });
}

// GET /api/v1/movies        (public theo curl; vẫn cho phép gắn JWT nếu có)
export async function getApiV1Movies(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/movies`,
    query,
    body: undefined,
    token: authToken
  });
}

// GET /api/v1/movies/:id    (curl có Authorization → yêu cầu JWT)
export async function getApiV1MoviesById(id: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/movies/${id}`,
    query,
    body: undefined,
    token: authToken
  });
}

// POST /api/v1/movies       (multipart/form-data; field tên: poster_url, movie_url)
export async function postApiV1Movies(body?: FormData | any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/movies`,
    query,
    body,
    token: authToken
  });
}

// PUT /api/v1/movies/:id    (metadata update; hỗ trợ JSON hoặc multipart nếu bạn cần)
export async function putApiV1MoviesById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/movies/${id}`,
    query,
    body,
    token: authToken
  });
}

// DELETE /api/v1/movies/:id (JWT)
export async function deleteApiV1MoviesById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/movies/${id}`,
    query,
    body: body ?? undefined,
    token: authToken
  });
}

// GET /api/v1/movies/search/:keyword  (public theo curl)
export async function getApiV1MoviesSearchByKeyword(keyword: string, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/movies/search/${encodeURIComponent(keyword)}`,
    query,
    body: undefined,
    token: authToken
  });
}

// ───── thêm mới theo dữ liệu bạn có ─────
// GET /api/v1/movies/by-genre?genre=Action  (public theo curl bạn cung cấp)
export async function getApiV1MoviesByGenre(genre: string, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/movies/by-genre`,
    query: { genre },
    body: undefined,
    token: authToken
  });
}

// ───────────────────── PROFILES (PLACEHOLDER) ─────────────────────
// LƯU Ý: BE hiện trả { err:1, message:"Route not found" } cho mọi /api/v1/profiles
// Giữ code sẵn: khi BE triển khai đúng route, chỉ cần đổi path là chạy.

export async function getApiV1ProfilesById(id: string|number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/profiles/${id}`,   // ← đổi nếu BE dùng path khác
    query,
    body: undefined,
    token: authToken
  });
}

export async function postApiV1Profiles(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/profiles`,        // ← đổi nếu BE dùng path khác
    query,
    body,
    token: authToken
  });
}

export async function putApiV1ProfilesById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/profiles/${id}`,  // ← đổi nếu BE dùng path khác
    query,
    body,
    token: authToken
  });
}

export async function deleteApiV1ProfilesById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/profiles/${id}`,  // ← đổi nếu BE dùng path khác
    query,
    body: body ?? undefined,
    token: authToken
  });
}

// ───────────────────── RATINGS ─────────────────────

/** GET /api/v1/ratings/:movieId  (public) */
export async function getApiV1RatingsByMovieid(movieId: string | number, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'GET',
    path: `/api/v1/ratings/${movieId}`,
    query,
    body: undefined,
    token: authToken   // public nhưng vẫn chấp nhận gắn JWT nếu có
  });
}

/** POST /api/v1/ratings   body: { movie_id, stars, comment? } (JWT) */
export async function postApiV1Ratings(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'POST',
    path: `/api/v1/ratings`,
    query,
    body,
    token: authToken
  });
}

/** PUT /api/v1/ratings    body: { movie_id, stars, comment? } (JWT) */
export async function putApiV1Ratings(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/ratings`,
    query,
    body,
    token: authToken
  });
}

/** DELETE /api/v1/ratings body: { movie_id } (JWT) */
export async function deleteApiV1Ratings(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined;
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/ratings`,
    query,
    body,
    token: authToken
  });
}

// ───────────────────── USER ─────────────────────
// GET /api/v1/user               → trả "me" theo JWT
export async function getApiV1User(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'GET',
    path: `/api/v1/user`,
    query,
    body: undefined,
    token: authToken
  })
}

// POST /api/v1/user              → tạo user mới (admin)
export async function postApiV1User(body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'POST',
    path: `/api/v1/user`,
    query,
    body,
    token: authToken
  })
}

// GET /api/v1/user/all           → danh sách user (admin)
export async function getApiV1UserAll(query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'GET',
    path: `/api/v1/user/all`,
    query,
    body: undefined,
    token: authToken
  })
}

// PUT /api/v1/user/:id           → cập nhật user (admin)
export async function putApiV1UserById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'PUT',
    path: `/api/v1/user/${id}`,
    query,
    body,
    token: authToken
  })
}

// DELETE /api/v1/user/:id        → xoá user (admin)
export async function deleteApiV1UserById(id: string|number, body?: any, query?: Record<string, any>, token?: string) {
  const authToken = token ?? getToken() ?? undefined
  return apiFetch({
    method: 'DELETE',
    path: `/api/v1/user/${id}`,
    query,
    body: body ?? undefined,
    token: authToken
  })
}

