// Tiny JWT utils: decode (base64url), parse payload, check exp
function base64UrlDecode(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4 ? 4 - (input.length % 4) : 0;
  const base64 = input + '='.repeat(pad);
  if (typeof window === 'undefined') return Buffer.from(base64, 'base64').toString('utf-8');
  return decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
}

export type JwtPayload = { exp?: number; iat?: number; id?: number|string; role?: string; [k: string]: any };

export function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payloadStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadStr);
    return payload;
  } catch {
    return null;
  }
}

export function isExpired(token: string | null): boolean {
  const payload = parseJwt(token);
  if (!payload?.exp) return false; // nếu BE không set exp thì coi như không hết hạn ở FE
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function getRole(token: string | null): string | undefined {
  return parseJwt(token)?.role;
}

export function decodeJWT<T = any>(token?: string): (T & { role?: string; id?: number }) | null {
  try {
    if (!token) return null
    const p = token.split('.')[1]
    if (!p) return null
    const json = decodeURIComponent(
      atob(p).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}
