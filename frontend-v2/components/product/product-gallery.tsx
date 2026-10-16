'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Mobile: swipeable carousel */}
      <div className="relative md:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`${name} photos`}
          role="region"
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={`${name}, photo ${i + 1} of ${images.length}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
            {images.map((src, i) => (
              <span
                key={src}
                className={cn(
                  'h-1.5 rounded-full bg-navy/25 transition-all',
                  i === active ? 'w-5 bg-navy' : 'w-1.5',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: main image + thumbnails */}
      <div className="relative hidden aspect-square overflow-hidden rounded-3xl bg-muted shadow-soft ring-1 ring-border/60 md:block">
        <Image
          src={images[active]}
          alt={`${name}, photo ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="hidden grid-cols-5 gap-3 md:grid">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl bg-muted ring-2 transition-all outline-none focus-visible:ring-ring',
                i === active ? 'ring-primary' : 'ring-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
