'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  label = 'Quantity',
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
  className?: string
}) {
  const btn = cn(
    'flex items-center justify-center text-navy transition-colors hover:bg-secondary active:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-35 outline-none focus-visible:ring-4 focus-visible:ring-ring/30',
    size === 'md' ? 'size-12' : 'size-10',
  )
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center overflow-hidden rounded-xl border border-input bg-card',
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
        }}
        className={cn(
          'w-10 [appearance:textfield] bg-transparent text-center font-semibold text-navy outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          size === 'md' ? 'text-base' : 'text-sm',
        )}
      />
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
