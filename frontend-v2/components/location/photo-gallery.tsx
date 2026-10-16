'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { resolveMediaUrl } from '@/lib/api/client'
import { getGallery } from '@/lib/api/shopInfo'
import { cn } from '@/lib/utils'

type PhotoItem = { src: string; alt: string; span: string }

const fallbackPhotos: PhotoItem[] = [
  { src: '/images/shop-1.png', alt: 'Bright shop interior with phones on white shelves', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/shop-3.png', alt: 'Navy shop front on a Sofia street', span: '' },
  { src: '/images/shop-2.png', alt: 'Technician repairing a smartphone', span: '' },
  { src: '/images/shop-4.png', alt: 'Wall of phone cases and cables', span: '' },
  { src: '/images/shop-5.png', alt: 'Handing a repaired phone to a customer', span: '' },
  { src: '/images/shop-6.png', alt: 'Repair tools laid out on an anti-static mat', span: 'col-span-2 md:col-span-4' },
]

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>(fallbackPhotos)
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const go = (d: number) =>
    setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length))

  useEffect(() => {
    getGallery()
      .then((res) => {
        if (res.length > 0) {
          setPhotos(
            res.map((img, i) => ({
              src: resolveMediaUrl(img.image, '/images/shop-1.png'),
              alt: img.caption || 'Shop photo',
              span: i === 0 ? 'md:col-span-2 md:row-span-2' : '',
            }))
          )
        }
      })
      .catch(() => {
        // Keep fallback photos
      })
  }, [])

  return (
    <>
      <ul className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {photos.map((p, i) => (
          <li key={`${p.src}-${i}`} className={cn(i === 0 && 'col-span-2 row-span-2', p.span)}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative size-full overflow-hidden rounded-2xl bg-muted outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-navy opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent
          className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl bg-navy p-0 text-navy-foreground ring-0 sm:max-w-5xl [&>[data-slot=dialog-close]]:z-10 [&>[data-slot=dialog-close]]:size-11 [&>[data-slot=dialog-close]]:bg-card/90 [&>[data-slot=dialog-close]]:text-navy"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
          }}
        >
          {index !== null && photos[index] && (
            <>
              <DialogTitle className="sr-only">{photos[index].alt}</DialogTitle>
              <div className="relative aspect-[4/3] w-full bg-navy md:aspect-[16/10]">
                <Image
                  src={photos[index].src}
                  alt={photos[index].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 md:p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="text-navy-foreground hover:bg-navy-foreground/10"
                >
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <p className="line-clamp-1 text-center text-sm text-navy-foreground/80">
                  {photos[index].alt}
                  <span className="ml-2 text-navy-foreground/50">
                    {index + 1} / {photos.length}
                  </span>
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="text-navy-foreground hover:bg-navy-foreground/10"
                >
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}