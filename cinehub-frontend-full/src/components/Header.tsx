import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '@/state/UserContext'
import { Film, Search, Heart } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useUser()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(q)}`) }

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-zinc-800">
      <div className="container h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Film className="w-6 h-6" /> <span>CineHub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-white' : 'text-muted hover:text-white'}>Trang chủ</NavLink>
          <NavLink to="/favorites" className={({isActive}) => isActive ? 'text-white' : 'text-muted hover:text-white'}>Yêu thích</NavLink>
        </nav>
        <form onSubmit={onSubmit} className="ml-auto hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-500 w-72"
              placeholder="Tìm phim, thể loại..." value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <button className="button button-outline text-sm">Tìm</button>
        </form>
        <div className="md:hidden ml-auto">
          <Link to="/favorites" className="button button-outline px-3"><Heart className="w-4 h-4"/></Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:block opacity-80">Xin chào, <b>{user.displayName}</b></span>
              <button className="button button-outline" onClick={logout}>Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="button button-primary text-sm">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  )
}
