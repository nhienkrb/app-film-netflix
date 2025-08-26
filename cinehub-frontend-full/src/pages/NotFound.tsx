import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="container py-24 text-center space-y-4">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="opacity-80">Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="button button-primary">Về trang chủ</Link>
    </div>
  )
}
