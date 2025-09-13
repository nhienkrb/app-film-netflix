import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { decodeJWT } from '../lib/jwt'
export default function Register() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!agree) {
      setError('Bạn cần đồng ý với Điều khoản & Chính sách')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu phải tối thiểu 6 ký tự')
      return
    }
    if (password !== confirm) {
      setError('Mật khẩu nhập lại không khớp')
      return
    }

    setLoading(true)
    try {
      // Backend của bạn nhận: display_name, email, password
      const res = await api.postApiV1AuthRegister({
        display_name: displayName || undefined,
        email,
        password,
      })

      const token = res?.data || res?.token
      if (!token) throw new Error('Token không tồn tại trong phản hồi')

      localStorage.setItem('cinehub.token', token)

        const p = decodeJWT(token)
        if (p?.id || p?.role) {
        const cached = JSON.parse(localStorage.getItem('cinehub.user') || '{}')
        localStorage.setItem('cinehub.user', JSON.stringify({ ...cached, id: p.id, role: p.role }))
        }


      // (tuỳ chọn) lấy thông tin user để cache
      try {
        const u = await api.getApiV1User?.()
        if (u?.data) localStorage.setItem('cinehub.user', JSON.stringify(u.data))
      } catch {/* ignore */}

      navigate('/')
    } catch (err: any) {
      // nếu fetcher của bạn đính kèm e.body.message → ưu tiên hiển thị
      const msg = err?.body?.message || err?.message || 'Đăng ký thất bại'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg">
        <h1 className="mb-1 text-2xl font-semibold">Đăng ký</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-red-400 hover:underline">Đăng nhập</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Tên hiển thị (tùy chọn)</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="user name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Mật khẩu</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Nhập lại mật khẩu</label>
            <input
              type="password"
              value={confirm}
              required
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800"
            />
            <label htmlFor="agree" className="text-sm text-zinc-400">
              Tôi đồng ý với{' '}
              <Link to="/terms" className="text-red-400 hover:underline">Điều khoản</Link>
              {' '} &{' '}
              <Link to="/privacy" className="text-red-400 hover:underline">Chính sách</Link>.
            </label>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 py-2 font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý…' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-zinc-400 hover:underline">Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
