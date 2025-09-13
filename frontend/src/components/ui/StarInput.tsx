// src/components/ui/StarInput.tsx
import React from 'react'

type Props = {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md'
  readOnly?: boolean
}

export default function StarInput({ value, onChange, size = 'md', readOnly }: Props) {
  const stars = [1, 2, 3, 4, 5]
  const cls = size === 'sm' ? 'text-sm' : 'text-base'
  return (
    <div className={`inline-flex items-center gap-1 ${cls}`}>
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className={`rounded px-1 ${readOnly ? 'cursor-default' : 'hover:scale-110 transition'}`}
          onClick={() => !readOnly && onChange?.(s)}
          aria-label={`${s} sao`}
        >
          <span className={s <= value ? 'text-yellow-400' : 'text-zinc-500'}>★</span>
        </button>
      ))}
    </div>
  )
}
