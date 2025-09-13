import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { decodeJWT } from '../lib/jwt'
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await api.postApiV1AuthLogin({ email, password })
      const token = res?.data || res?.token
      localStorage.setItem('cinehub.token', token)

    // Lưu nhanh thông tin nhận dạng từ JWT
    const p = decodeJWT(token)            // { id, role, ... }
    if (p?.id || p?.role) {
    const cached = JSON.parse(localStorage.getItem('cinehub.user') || '{}')
    localStorage.setItem('cinehub.user', JSON.stringify({ ...cached, id: p.id, role: p.role }))
    }

      if (!token) throw new Error('Token không tồn tại')

      // Lưu token
      if (remember) {
        localStorage.setItem('cinehub.token', token)
      } else {
        sessionStorage.setItem('cinehub.token', token)
      }

      // Optional: fetch profile (nếu backend có /api/v1/user)
      try {
        const profile = await api.getApiV1User()
        if (profile?.data) {
          localStorage.setItem('cinehub.user', JSON.stringify(profile.data))
        }
      } catch {
        // ignore nếu chưa có endpoint
      }

      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg">
        <h1 className="mb-1 text-2xl font-semibold">Đăng nhập</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Chào mừng quay lại CineHub. Chưa có tài khoản?{' '}
          <Link to="/register" className="text-red-400 hover:underline">Đăng ký</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800"
            />
            <label htmlFor="remember" className="text-sm text-zinc-400">
              Ghi nhớ đăng nhập
            </label>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 py-2 font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-zinc-400 hover:underline">Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
