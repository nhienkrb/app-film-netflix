import { parseJwt, isExpired, getRole, type JwtPayload } from './jwt';

const KEY = 'cinehub.token';

// Token storage
export function getToken(): string | null {
  const t = localStorage.getItem(KEY);
  return t || null;
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(KEY, t);
  else localStorage.removeItem(KEY);
}
export function clearToken() { localStorage.removeItem(KEY); }

// Snapshot user từ token
export type SessionInfo = {
  isAuthenticated: boolean;
  isExpired: boolean;
  role?: string;
  payload?: JwtPayload | null;
  token?: string | null;
  isAdmin: boolean;
  isViewer: boolean;
  isUser: boolean;
};

export function getSession(): SessionInfo {
  const token = getToken();
  const expired = isExpired(token);
  const role = getRole(token);
  const payload = parseJwt(token);
  const isAuthenticated = !!token && !expired;

  // mapping theo yêu cầu: viewer (bình thường), user (verify role + token), admin (verify role + token + isAdmin)
  const isViewer = role === 'viewer' && isAuthenticated;
  const isUser   = role === 'user'   && isAuthenticated;
  const isAdmin  = role === 'admin'  && isAuthenticated;

  return {
    isAuthenticated,
    isExpired: expired,
    role,
    payload,
    token,
    isAdmin,
    isViewer,
    isUser,
  };
}
