// src/components/navigation/Breadcrumbs.tsx
import { memo, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

export type Crumb = { label: string; href?: string }

export type BreadcrumbsProps = {
  /** Ghi đè nhãn crumb cuối (ví dụ tiêu đề phim) */
  currentLabel?: string
  /** Tuỳ chọn: cung cấp danh sách crumbs sẵn, bỏ qua auto-derive */
  items?: Crumb[]
  /** Loading state cho trang chi tiết (hiển thị skeleton) */
  loading?: boolean
  className?: string
}

/** Từ điển nhãn cho các segment thường dùng */
const LABELS: Record<string, string> = {
  '': 'Trang chủ',
  home: 'Trang chủ',
  search: 'Tìm kiếm',
  favorites: 'Yêu thích',
  history: 'Đã xem',
  billing: 'Gói dịch vụ',
  profile: 'Hồ sơ',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  movie: 'Phim',
  watch: 'Xem',
  admin: 'Quản trị',
  movies: 'Phim',
  users: 'Người dùng',
  reviews: 'Bình luận',
  genres: 'Thể loại',
}

/** Chuyển segment → nhãn thân thiện */
function toLabel(seg: string): string {
  if (LABELS[seg]) return LABELS[seg]
  if (/^\d+$/.test(seg)) return `#${seg}`
  const pretty = seg.replace(/-/g, ' ')
  return pretty.charAt(0).toUpperCase() + pretty.slice(1)
}

/** Tạo mảng crumbs từ pathname */
function deriveFromPath(pathname: string, currentLabel?: string): Crumb[] {
  const raw = pathname.split('?')[0]
  const parts = raw.split('/').filter(Boolean)

  const crumbs: Crumb[] = []
  // Home luôn đứng đầu
  crumbs.push({ label: LABELS[''], href: '/' })

  let acc = ''
  parts.forEach((seg, idx) => {
    acc += '/' + seg
    const isLast = idx === parts.length - 1
    const label = isLast && currentLabel ? currentLabel : toLabel(seg)
    crumbs.push({ label, href: isLast ? undefined : acc })
  })

  return crumbs
}

function Breadcrumbs({ currentLabel, items, loading, className }: BreadcrumbsProps) {
  const { pathname } = useLocation()

  const crumbs = useMemo<Crumb[]>(() => {
    if (items && items.length) return items
    return deriveFromPath(pathname, currentLabel)
  }, [items, pathname, currentLabel])

  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full overflow-x-auto py-2 text-sm ${className ?? ''}`}
    >
      <ol className="flex items-center gap-1 text-zinc-400">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="px-1 text-zinc-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" className="inline-block align-[-2px]">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  </svg>
                </span>
              )}

              {isLast ? (
                loading ? (
                  <span
                    className="inline-block h-5 w-24 rounded-md align-middle bg-zinc-800/60 animate-pulse"
                    aria-busy="true"
                    aria-live="polite"
                  />
                ) : (
                  <span className="text-white" aria-current="page">
                    {c.label}
                  </span>
                )
              ) : c.href ? (
                <Link
                  to={c.href}
                  className="hover:text-white hover:underline underline-offset-4"
                >
                  {i === 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 11l9-7 9 7v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3z" fill="currentColor"/>
                      </svg>
                      {c.label}
                    </span>
                  ) : (
                    c.label
                  )}
                </Link>
              ) : (
                <span className="text-zinc-300">{c.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default memo(Breadcrumbs)
