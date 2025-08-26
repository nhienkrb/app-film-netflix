import { ReactNode, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function CarouselRow({ title, children }:{ title:ReactNode; children:ReactNode }){
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (dx:number) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' })
  const itemWidth = 180
  return (
    <section className="container my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        <div className="hidden md:flex gap-2">
          <button className="button button-outline px-2" onClick={()=>scrollBy(-itemWidth*3)}><ChevronLeft className="w-5 h-5"/></button>
          <button className="button button-outline px-2" onClick={()=>scrollBy(itemWidth*3)}><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">{children}</div>
    </section>
  )
}
