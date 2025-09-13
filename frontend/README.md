# CineHub Lite — Frontend (React + Vite + Tailwind)
Mục tiêu: tối giản UI, tập trung **gọi đầy đủ API** từ backend.

## Chạy dev
```bash
npm i
npm run dev
```
Cấu hình base URL qua biến môi trường Vite:
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
```

## Sử dụng (không UI)
- Mở Console → namespace `api` đã được export (flatten + byGroup).
- Ví dụ:
  ```js
  // GET danh sách (tuỳ endpoint tồn tại)
  await api.movies.getApiV1Movies()
  // GET theo id:
  await api.movies.getApiV1MoviesById(123)
  // POST tạo:
  await api.movies.postApiV1Movies({ title: 'Inception' })
  ```

## Cấu trúc
- src/lib/fetcher.ts — wrapper fetch chuẩn hoá (JWT, query, lỗi)
- src/lib/auth.ts — lưu token localStorage
- src/api/*.ts — auto sinh từ danh sách endpoint đã quét (mỗi resource 1 file)
- src/App.tsx — không UI, chỉ mount & gợi ý dùng Console

## Ghi chú
- Nếu backend yêu cầu token: `localStorage.setItem('cinehub.token', '<JWT>')`.
- Nếu có multipart upload: truyền `FormData` làm body, fetcher sẽ giữ nguyên.
- Các type response hiện để `unknown`; có thể nâng cấp bằng OpenAPI để sinh type.

### Flatten vs Group
- Flatten (khuyến nghị): `api.<FunctionName>()`
- Grouped: `api.<group>.<FunctionName>()` — ví dụ `api.api.getApiV1Movies()` nếu group là `api`.
