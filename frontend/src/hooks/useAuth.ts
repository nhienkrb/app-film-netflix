import { useEffect, useMemo, useState, useCallback } from 'react'

export type AuthSnapshot = {
  isAuthenticated: boolean
  role?: string
  isAdmin: boolean
  token?: string
  payload?: Record<string, any>
}

type Options = {
  /** localStorage key chứa token */
  storageKey?: string
  /** giá trị role được coi là admin */
  adminRole?: string
  /** tên field lấy role trong payload (hỗ trợ dot-path: "user.role") */
  roleField?: string
}

const DEFAULT_KEY = 'cinehub.token'
const DEFAULT_ADMIN_ROLE = 'admin'
const DEFAULT_ROLE_FIELD = 'role'

function safeParseJwt(token: string): Record<string, any> | undefined {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return undefined
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(window.atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonStr)
  } catch {
    return undefined
  }
}

function getByPath(obj: any, path: string): any {
  if (!obj) return undefined
  if (!path.includes('.')) return obj?.[path]
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

/**
 * Hook auth tối giản, tự đọc token từ localStorage và (nếu là JWT) parse payload để suy ra role.
 * - Không phụ thuộc alias hay thư viện ngoài.
 * - Tự cập nhật khi token thay đổi (sự kiện 'storage' giữa tab); cung cấp `refresh()` cho cùng tab.
 */
export default function useAuth(opts?: Options) {
  const storageKey = opts?.storageKey ?? DEFAULT_KEY
  const adminRole = opts?.adminRole ?? DEFAULT_ADMIN_ROLE
  const roleField = opts?.roleField ?? DEFAULT_ROLE_FIELD

  const readSnapshot = useCallback((): AuthSnapshot => {
    if (typeof window === 'undefined') return { isAuthenticated: false, isAdmin: false }
    const token = window.localStorage.getItem(storageKey) || undefined
    if (!token) return { isAuthenticated: false, isAdmin: false }

    const payload = safeParseJwt(token)
    const role = payload ? getByPath(payload, roleField) : undefined
    const isAdmin = role === adminRole
    return { isAuthenticated: true, role, isAdmin, token, payload }
  }, [storageKey, adminRole, roleField])

  const [snap, setSnap] = useState<AuthSnapshot>(() => readSnapshot())

  const refresh = useCallback(() => setSnap(readSnapshot()), [readSnapshot])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) setSnap(readSnapshot())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey, readSnapshot])

  return useMemo(() => ({ ...snap, refresh }), [snap, refresh])
}
