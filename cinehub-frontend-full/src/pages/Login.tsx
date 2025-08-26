import { useUser } from '@/state/UserContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login(){
  const { login } = useUser()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ id: 1, email, displayName: name || 'User', role: 'viewer' })
    navigate('/')
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập nhanh (demo)</h1>
      <form onSubmit={onSubmit} className="space-y-4 card p-6">
        <div className="space-y-1">
          <label className="text-sm opacity-80">Email</label>
          <input className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-500"
            type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm opacity-80">Tên hiển thị</label>
          <input className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-500"
            value={name} onChange={e=>setName(e.target.value)} placeholder="Tên của bạn (tuỳ chọn)" />
        </div>
        <button className="button button-primary w-full">Đăng nhập</button>
      </form>
      <p className="mt-3 text-sm opacity-70">* Đây là login demo (frontend), chưa kết nối backend.</p>
    </div>
  )
}
