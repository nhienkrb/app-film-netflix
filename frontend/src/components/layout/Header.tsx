// src/components/layout/Header.tsx
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getMe } from '../../features/users'

// ---------- Search helpers ----------
async function defaultSuggest(q: string, opts?: { limit?: number }): Promise<string[]> {
  try {
    const url = `/api/search/suggest?q=${encodeURIComponent(q)}${opts?.limit ? `&limit=${opts.limit}` : ''}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items ?? data.data ?? [])
    return (list ?? []).map(String)
  } catch {
    return []
  }
}
function asList<T = any>(res: any, fallback: T[] = []): T[] {
  if (!res) return fallback
  if (Array.isArray(res)) return res
  return (res.items ?? res.data ?? fallback) as T[]
}

// ---------- SearchBar ----------
function SearchBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [kw, setKw] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<string[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const suggestFn = useMemo(() => defaultSuggest, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Debounce + cancel stale
  const reqIdRef = useRef(0)
  useEffect(() => {
    const q = kw.trim()
    if (!q) { setItems([]); setOpen(false); return }
    const rid = ++reqIdRef.current
    const t = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await suggestFn(q, { limit: 8 })
        if (reqIdRef.current !== rid) return
        const list = asList<string>(res, []).slice(0, 8)
        setItems(list); setOpen(list.length > 0)
      } finally {
        if (reqIdRef.current === rid) setLoading(false)
      }
    }, 250)
    return () => window.clearTimeout(t)
  }, [kw, suggestFn])

  const go = (value?: string) => {
    const q = (value ?? kw).trim()
    if (!q) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-lg">
      <form
        onSubmit={(e) => { e.preventDefault(); go() }}
        className="flex items-center gap-2"
        role="search"
        aria-label="Tìm kiếm phim"
      >
        <div className="relative flex-1">
          <input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onFocus={() => items.length && setOpen(true)}
            inputMode="search"
            placeholder="Tìm phim…"
            autoComplete="off"
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 px-4 py-2.5 pr-9 text-sm
                       placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/40"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
          </span>
        </div>
        <button type="submit" className="btn-ghost text-sm px-3 py-2 rounded-lg border border-zinc-800">
          Tìm
        </button>
      </form>

      {open && (
        <div
          className="absolute z-40 mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur
                     shadow-xl overflow-hidden"
          role="listbox"
          aria-label="Gợi ý tìm kiếm"
        >
          {loading && <div className="px-3 py-2 text-xs text-zinc-400">Đang gợi ý…</div>}
          {!loading && !items.length && <div className="px-3 py-2 text-xs text-zinc-400">Không có gợi ý</div>}
          {!loading && items.map((it, idx) => (
            <button
              key={`${it}-${idx}`}
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(it)}
              role="option"
            >
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Header ----------
function Header() {
  const { isAuthenticated, isAdmin, payload, refresh } = useAuth({
    storageKey: 'cinehub.token',
    adminRole: 'admin',
    roleField: 'role',
  })
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Đóng menu mobile khi đổi route
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Theo dõi token đổi ngay trong tab hiện tại (storage event không bắn ở same-tab).
  useEffect(() => {
    const last = { current: localStorage.getItem('cinehub.token') }
    const id = window.setInterval(() => {
      const cur = localStorage.getItem('cinehub.token')
      if (cur !== last.current) {
        last.current = cur
        try { (refresh as any)?.() } catch {}
      }
    }, 400)
    return () => window.clearInterval(id)
  }, [refresh])

  // Tên hiển thị
  const [displayName, setDisplayName] = useState<string | undefined>(undefined)

  // 1) lấy nhanh từ JWT (nếu có)
  useEffect(() => {
    const p: any = payload || {}
    const n =
      p.display_name || p.name || p.username ||
      p.user?.display_name || p.user?.name || p.user?.username ||
      p.email
    setDisplayName(n ? String(n) : undefined)
  }, [payload])

  // 2) nếu JWT không có tên → gọi API chuẩn
  useEffect(() => {
    let stop = false
    ;(async () => {
      if (!isAuthenticated) { setDisplayName(undefined); return }
      if (displayName) return
      try {
        const res = await getMe()
        const u = (res as any)?.data ?? res
        if (stop || !u) return
        const n =
          u.display_name || u.name || u.username ||
          u.user?.display_name || u.user?.name || u.user?.username ||
          u.email || (u.id ? `User #${u.id}` : undefined)
        if (n) setDisplayName(String(n))
      } catch {
        // ignore
      }
    })()
    return () => { stop = true }
  }, [isAuthenticated, displayName])

  const initial = (displayName?.[0]?.toUpperCase() || 'U')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
      <div className="container safe-pads flex h-16 items-center justify-between gap-3">
        {/* Left: brand + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden icon-btn border border-zinc-800"
            aria-label="Mở menu"
            onClick={() => setMobileOpen(v => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-base font-semibold tracking-wide">CineHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden lg:flex items-center gap-2 text-sm">
            <NavItem to="/">Trang chủ</NavItem>
            <NavItem to="/search">Tìm kiếm</NavItem>
            <NavItem to="/favorites">Yêu thích</NavItem>
            <NavItem to="/history">Đã xem</NavItem>
            <NavItem to="/billing">Gói dịch vụ</NavItem>
            {isAdmin && <NavItem to="/admin">Quản trị</NavItem>}
          </nav>
        </div>

        {/* Center: search */}
        <div className="hidden md:block flex-1">
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>

        {/* Right: account */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-ghost text-sm px-3 py-2 rounded-lg border border-zinc-800">Đăng nhập</Link>
              <Link to="/register" className="btn text-sm btn-lg rounded-lg">Đăng ký</Link>
            </>
          ) : (
            <div className="relative group">
              <button
                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-1.5"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <span className="inline-flex items-center justify-center size-8 rounded-full bg-zinc-800 text-sm">
                  {initial}
                </span>
                <span className="hidden sm:block text-sm pr-1 max-w-[160px] truncate">{displayName || 'User'}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                </svg>
              </button>

              {/* menu */}
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition
                              absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur shadow-xl p-1">
                <Link className="menu-item" to="/favorites">Yêu thích</Link>
                <Link className="menu-item" to="/history">Lịch sử xem</Link>
                <Link className="menu-item" to="/billing">Gói dịch vụ</Link>
                {isAdmin && <Link className="menu-item" to="/admin">Bảng điều khiển</Link>}
                <div className="h-px bg-zinc-800 my-1" />
                <button
                  className="menu-item"
                  onClick={async () => {
                    try { localStorage.removeItem('cinehub.token') } finally {
                      try { (refresh as any)?.() } catch {}
                      navigate('/login')
                    }
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: search bar & nav */}
      <div className="border-t border-zinc-800/60 md:hidden">
        <div className="container py-2">
          <SearchBar />
        </div>
        {mobileOpen && (
          <nav className="container pb-3">
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <NavItem to="/" onNavigate={() => setMobileOpen(false)}>Trang chủ</NavItem>
              <NavItem to="/search" onNavigate={() => setMobileOpen(false)}>Tìm kiếm</NavItem>
              <NavItem to="/favorites" onNavigate={() => setMobileOpen(false)}>Yêu thích</NavItem>
              <NavItem to="/history" onNavigate={() => setMobileOpen(false)}>Đã xem</NavItem>
              <NavItem to="/billing" onNavigate={() => setMobileOpen(false)}>Gói dịch vụ</NavItem>
              {isAdmin && <NavItem to="/admin" onNavigate={() => setMobileOpen(false)}>Quản trị</NavItem>}
              {!isAuthenticated ? (
                <>
                  <NavItem to="/login" onNavigate={() => setMobileOpen(false)}>Đăng nhập</NavItem>
                  <NavItem to="/register" onNavigate={() => setMobileOpen(false)}>Đăng ký</NavItem>
                </>
              ) : (
                <>
                  <NavItem to="/profile" onNavigate={() => setMobileOpen(false)}>Hồ sơ</NavItem>
                  <button
                    className="menu-item border border-zinc-800"
                    onClick={async () => {
                      try { localStorage.removeItem('cinehub.token') } finally {
                        try { (refresh as any)?.() } catch {}
                        navigate('/login')
                      }
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

// small nav-link wrapper with active state
function NavItem({
  to,
  children,
  onNavigate,
}: {
  to: string
  children: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg transition text-sm ${
          isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default memo(Header)
