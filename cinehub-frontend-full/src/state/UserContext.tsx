import React, { createContext, useContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
export type User = { id:number; email:string; displayName:string; role:'viewer'|'admin' }
type Ctx = { user:User|null; login:(u:User)=>void; logout:()=>void }
const UserCtx = createContext<Ctx | null>(null)
export function UserProvider({ children }:{ children:React.ReactNode }){
  const [user, setUser] = useLocalStorage<User | null>('user', null)
  const login = (u:User) => setUser(u)
  const logout = () => setUser(null)
  return <UserCtx.Provider value={{ user, login, logout }}>{children}</UserCtx.Provider>
}
export const useUser = () => { const c=useContext(UserCtx); if(!c) throw new Error('useUser in provider'); return c }
