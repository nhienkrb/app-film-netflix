import React, { createContext, useContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
type Ctx = { favorites:number[]; toggle:(id:number)=>void; has:(id:number)=>boolean }
const FavoritesCtx = createContext<Ctx | null>(null)
export function FavoritesProvider({ children }: { children: React.ReactNode }){
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', [])
  const toggle = (id:number) => setFavorites(p => p.includes(id) ? p.filter(x=>x!==id) : [id, ...p])
  const has = (id:number) => favorites.includes(id)
  return <FavoritesCtx.Provider value={{ favorites, toggle, has }}>{children}</FavoritesCtx.Provider>
}
export const useFavorites = () => { const c=useContext(FavoritesCtx); if(!c) throw new Error('useFavorites in provider'); return c }
