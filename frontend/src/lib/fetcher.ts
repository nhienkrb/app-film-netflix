export type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS';

export interface FetchOptions<TBody=any> {
  method?: HttpMethod;
  path: string;
  query?: Record<string, any>;
  body?: TBody;
  headers?: Record<string, string>;
  token?: string;
  signal?: AbortSignal;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function buildUrl(path: string, query?: Record<string, any>) {
  const url = new URL(path, BASE_URL);
  if (query) {
    Object.entries(query)
      .filter(([,v]) => v !== undefined && v !== null)
      .forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }
  return url.toString();
}

export async function apiFetch<T=unknown, TBody=any>(opts: FetchOptions<TBody>): Promise<T> {
  const { method='GET', path, query, body, headers={}, token, signal } = opts;
  const url = buildUrl(path.startsWith('/') ? path : `/${path}`, query);
  const finalHeaders: Record<string,string> = {
    'Accept': 'application/json',
    ...headers,
  };
  let payload: BodyInit|undefined = undefined;
  if (body !== undefined && body !== null && method !== 'GET' && method !== 'HEAD') {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
    payload = typeof body === 'string' || body instanceof FormData ? body as any : JSON.stringify(body);
  }
  if (token) finalHeaders['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method, headers: finalHeaders, body: payload, signal, credentials: 'include' });
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let errBody: any = undefined;
    try {
      errBody = contentType.includes('application/json') ? await res.json() : await res.text();
    } catch {}
    const error = new Error(`HTTP ${res.status} ${res.statusText}`) as any;
    error.status = res.status;
    error.body = errBody;
    throw error;
  }
  if (method === 'HEAD') return undefined as unknown as T;
  if (contentType.includes('application/json')) return await res.json() as T;
  // Fallback: text
  return await res.text() as unknown as T;
}
