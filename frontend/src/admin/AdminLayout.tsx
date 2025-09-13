import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { getSession, clearToken } from "../lib/auth"

type Item = { to: string; label: string; exact?: boolean; icon?: JSX.Element }

const NAV: Item[] = [
  { to: "/admin",               label: "Dashboard",    exact: true,  icon: <IconHome/> },
  { to: "/admin/movies",        label: "Movies",                     icon: <IconFilm/> },
  { to: "/admin/users",         label: "Users",                      icon: <IconUsers/> },
  { to: "/admin/reviews",       label: "Reviews",                    icon: <IconStar/> },
  { to: "/admin/genres",        label: "Genres",                     icon: <IconTag/> },
  { to: "/admin/plans",         label: "Plans",                      icon: <IconCredit/> },
  { to: "/admin/subscriptions", label: "Subscriptions",              icon: <IconReceipt/> },
]

export default function AdminLayout() {
  const nav = useNavigate()
  const { isAuthenticated, role } = getSession()

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") nav("/403", { replace: true })
  }, [isAuthenticated, role, nav])

  // mobile drawer
  const [open, setOpen] = useState(false)
  // desktop mini sidebar
  const [mini, setMini] = useState(false)

  const year = useMemo(() => new Date().getFullYear(), [])

  function logout() {
    clearToken()
    nav("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:px-4">
          {/* Mobile: open drawer */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-800 lg:hidden"
          >
            <IconMenu />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">CineHub Admin</span>
            <span className="hidden text-xs text-zinc-500 sm:inline">• {year}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Desktop: toggle mini sidebar */}
            <button
              onClick={() => setMini((v) => !v)}
              className="hidden rounded-lg p-2 hover:bg-zinc-800 lg:inline-flex"
              aria-pressed={mini}
              aria-label="Toggle sidebar"
            >
              <IconSidebar />
            </button>

            <button
              onClick={logout}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Layout grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[auto,1fr]">
        {/* Sidebar (desktop) */}
        <aside
          className={`hidden lg:block ${mini ? "w-16" : "w-64"} border-r border-zinc-800 bg-zinc-950 transition-[width] duration-200`}
        >
          <nav className="flex h-[calc(100vh-56px)] flex-col gap-1 overflow-y-auto p-2">
            {NAV.map((i) => (
              <AdminNavLink key={i.to} item={i} mini={mini} onClick={() => {}} />
            ))}

            <div className="mt-auto rounded-lg border border-zinc-800 p-3 text-xs text-zinc-400">
              <div>CineHub Console</div>
              <div>v{import.meta.env.VITE_APP_VERSION ?? "1.0"}</div>
            </div>
          </nav>
        </aside>

        {/* Drawer (mobile & tablet) */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-800 bg-zinc-950 p-3 shadow-xl lg:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-base font-semibold">Menu</div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 hover:bg-zinc-800"
                >
                  <IconClose />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((i) => (
                  <AdminNavLink key={i.to} item={i} onClick={() => setOpen(false)} />
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main */}
        <main className="min-h-[calc(100vh-56px)] overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** ======== Sub components ======== */

function AdminNavLink({
  item,
  mini = false,
  onClick,
}: {
  item: Item
  mini?: boolean
  onClick?: () => void
}) {
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition",
          "hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-600",
          isActive ? "bg-zinc-800 text-white" : "text-zinc-300",
        ].join(" ")
      }
    >
      <span className="inline-flex h-5 w-5 items-center justify-center opacity-90">
        {item.icon}
      </span>
      <span className={`${mini ? "hidden" : "inline"} truncate`}>{item.label}</span>
    </NavLink>
  )
}

/** ======== Tiny inline icons (no extra deps) ======== */
function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function IconSidebar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5l9-7 9 7V20a2 2 0 0 1-2 2h-3v-7H8v7H5a2 2 0 0 1-2-2v-9.5z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
function IconFilm() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 4v4M7 16v4M17 4v4M17 16v4M3 12h18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 8a3 3 0 1 0-2.5 4.9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 17.3l-6.18 3.25L7 14.2 2 9.75l6.91-1L12 3l3.09 5.75 6.91 1L17 14.2l1.18 6.35L12 17.3z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20.59 13.41l-7.18 7.18a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
    </svg>
  )
}
function IconCredit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
function IconReceipt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3l2 2 2-2 2 2 2-2 2 2v16l-2-2-2 2-2-2-2 2-2-2V3z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 8h8M8 12h8M8 16h6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
