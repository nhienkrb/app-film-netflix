import api from '.'; // default aggregator
import { setToken, clearToken, getSession } from '../lib/auth';

// BE trả token ở field "data"
function extractToken(resp: any): string | null {
  if (!resp) return null;
  // theo mẫu bạn gửi:
  // { data: "<JWT>", message: "User login successfully" }
  return typeof resp.data === 'string' ? resp.data : null;
}

export async function login(payload: { email?: string; username?: string; account?: string; password: string }) {
  const res = await api.postApiV1AuthLogin(payload);
  const token = extractToken(res);
  if (!token) throw new Error('No token in response');
  setToken(token);
  return getSession();
}

export async function register(payload: { email: string; password: string; display_name?: string; username?: string }) {
  const res = await api.postApiV1AuthRegister(payload);
  const token = extractToken(res);
  if (!token) throw new Error('No token in response');
  setToken(token);
  return getSession();
}

export function logout() {
  clearToken();
  // form state sẽ reset trong component (xem Login/Register.tsx)
  return getSession();
}
