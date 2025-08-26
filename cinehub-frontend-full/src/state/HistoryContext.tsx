import React, { createContext, useContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
export type HistoryItem = { movieId:number; positionSec:number; updatedAt:number }
type Ctx = { items:HistoryItem[]; setProgress:(movieId:number,pos:number)=>void; getProgress:(movieId:number)=>number }
const HistoryCtx = createContext<Ctx | null>(null)
export function HistoryProvider({ children }:{ children:React.ReactNode }){
  const [items, setItems] = useLocalStorage<HistoryItem[]>('history', [])
  const setProgress = (movieId:number, pos:number) => setItems(p => [{ movieId, positionSec: pos, updatedAt: Date.now() }, ...p.filter(i=>i.movieId!==movieId)].slice(0,50))
  const getProgress = (movieId:number) => items.find(i=>i.movieId===movieId)?.positionSec ?? 0
  return <HistoryCtx.Provider value={{ items, setProgress, getProgress }}>{children}</HistoryCtx.Provider>
}
export const useHistoryStore = () => { const c=useContext(HistoryCtx); if(!c) throw new Error('useHistoryStore in provider'); return c }
