import { memo } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth' // đường dẫn tương đối, không dùng @/

function Footer() {
  const { role, isAuthenticated, isAdmin } = useAuth({
    storageKey: 'cinehub.token',   // đổi nếu dự án bạn dùng key khác
    adminRole: 'admin',            // đổi nếu bạn có role admin khác
    roleField: 'role',             // ví dụ 'user.role' nếu payload lồng
  })
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold text-white">CineHub</span>
            </Link>
            <p className="text-sm text-zinc-400">Movies. Anytime. Anywhere.</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Khám phá</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Trang chủ</Link></li>
              <li><Link to="/search" className="hover:text-white">Tìm kiếm</Link></li>
              <li><Link to="/favorites" className="hover:text-white">Yêu thích</Link></li>
              <li><Link to="/history" className="hover:text-white">Đã xem</Link></li>
              <li><Link to="/billing" className="hover:text-white">Gói dịch vụ</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Tài khoản</h3>
            <ul className="space-y-2 text-sm">
              {!isAuthenticated ? (
                <>
                  <li><Link to="/login" className="hover:text-white">Đăng nhập</Link></li>
                  <li><Link to="/register" className="hover:text-white">Đăng ký</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/profile" className="hover:text-white">Hồ sơ</Link></li>
                  <li><Link to="/favorites" className="hover:text-white">Danh sách yêu thích</Link></li>
                  <li><Link to="/history" className="hover:text-white">Lịch sử xem</Link></li>
                  <li><Link to="/billing" className="hover:text-white">Thanh toán & gói</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Quản trị</h3>
            <ul className="space-y-2 text-sm">
              {isAdmin ? (
                <>
                  <li><Link to="/admin" className="hover:text-white">Bảng điều khiển</Link></li>
                  <li><Link to="/admin/movies" className="hover:text-white">Quản lý phim</Link></li>
                  <li><Link to="/admin/users" className="hover:text-white">Quản lý người dùng</Link></li>
                  <li><Link to="/admin/reviews" className="hover:text-white">Quản lý bình luận</Link></li>
                </>
              ) : (
                <li className="text-zinc-500">Chỉ dành cho Admin{role ? ` (${role})` : ''}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-zinc-800" />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-3 text-sm text-zinc-400 sm:flex-row">
          <p>© {year} CineHub. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/terms" className="hover:text-white">Điều khoản</Link>
            <Link to="/privacy" className="hover:text-white">Quyền riêng tư</Link>
            <Link to="/support" className="hover:text-white">Hỗ trợ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
