import { useEffect, useRef } from 'react'
import { useHistoryStore } from '@/state/HistoryContext'
export default function VideoPlayer({ movieId, src }:{ movieId:number; src:string }){
  const ref = useRef<HTMLVideoElement>(null)
  const { setProgress, getProgress } = useHistoryStore()
  useEffect(()=>{
    const video = ref.current; if(!video) return
    const pos = getProgress(movieId); if (pos > 3) { video.currentTime = pos }
    const onTime = ()=> setProgress(movieId, Math.floor(video.currentTime))
    const onEnded = ()=> setProgress(movieId, 0)
    video.addEventListener('timeupdate', onTime); video.addEventListener('ended', onEnded)
    return ()=>{ video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnded) }
  }, [movieId])
  return (<div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800"><video ref={ref} controls className="w-full h-full" src={src}/></div>)
}
