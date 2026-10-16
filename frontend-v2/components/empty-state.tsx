import Image from 'next/image'
import { cn } from '@/lib/utils'

export function EmptyState({
  image,
  title,
  description,
  children,
  className,
  headingLevel = 'h2',
}: {
  image: string
  title: string
  description: string
  children?: React.ReactNode
  className?: string
  headingLevel?: 'h1' | 'h2'
}) {
  const Heading = headingLevel
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-5 rounded-3xl bg-card px-6 py-12 text-center shadow-soft ring-1 ring-border/60 md:py-16',
        className,
      )}
    >
      <Image
        src={image}
        alt=""
        width={240}
        height={240}
        className="size-44 rounded-2xl object-contain md:size-56"
      />
      <div className="flex max-w-md flex-col gap-2">
        <Heading className="text-2xl font-bold tracking-tight text-balance text-navy md:text-3xl">
          {title}
        </Heading>
        <p className="text-pretty text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex flex-col gap-3 sm:flex-row">{children}</div>}
    </div>
  )
}
