'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export type Filters = {
  category: string
  type: 'all' | 'phones' | 'accessories'
  sort: 'newest' | 'price-asc' | 'price-desc'
}

export const categoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'phones', label: 'Phones' },
  { value: 'cases', label: 'Cases' },
  { value: 'chargers', label: 'Chargers' },
  { value: 'accessories', label: 'Accessories' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'phones', label: 'Phones' },
  { value: 'accessories', label: 'Accessories' },
] as const

const triggerClass =
  'h-11 data-[size=default]:h-11 w-full rounded-xl border-input bg-card px-3.5 text-[15px] font-medium text-navy md:w-56'

export function CategorySelect({
  value,
  onChange,
  id,
  options = categoryOptions,
}: {
  value: string
  onChange: (v: string) => void
  id: string
  options?: { value: string; label: string }[]
}) {
  return (
    <Select items={options} value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger id={id} className={triggerClass} aria-label="Category">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="min-h-10">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SortSelect({
  value,
  onChange,
  id,
}: {
  value: Filters['sort']
  onChange: (v: Filters['sort']) => void
  id: string
}) {
  return (
    <Select
      items={sortOptions}
      value={value}
      onValueChange={(v) => v && onChange(v as Filters['sort'])}
    >
      <SelectTrigger id={id} className={triggerClass} aria-label="Sort by">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((o) => (
          <SelectItem key={o.value} value={o.value} className="min-h-10">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function TypeToggle({
  value,
  onChange,
  className,
}: {
  value: Filters['type']
  onChange: (v: Filters['type']) => void
  className?: string
}) {
  return (
    <ToggleGroup
      aria-label="Product type"
      value={[value]}
      onValueChange={(v) => v[0] && onChange(v[0] as Filters['type'])}
      spacing={1}
      className={cn('rounded-xl bg-secondary p-1', className)}
    >
      {typeOptions.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className="h-9 flex-auto rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-card/60 hover:text-navy aria-pressed:bg-card aria-pressed:text-navy aria-pressed:shadow-soft data-pressed:bg-card data-pressed:text-navy data-pressed:shadow-soft"
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-navy">
        {label}
      </Label>
      {children}
    </div>
  )
}