import { Star } from 'lucide-react'
export default function RatingStars({ value }:{ value:number }){
  const stars = Array.from({ length: 5 }, (_, i) => i+1 <= Math.round(value))
  return (<div className="flex items-center gap-0.5">
    {stars.map((f,i)=>(<Star key={i} className={f?'text-yellow-400':'text-zinc-600'} width={16} height={16} fill={f?'currentColor':'none'} />))}
    <span className="ml-1 text-xs opacity-80">{value.toFixed(1)}</span>
  </div>)
}
