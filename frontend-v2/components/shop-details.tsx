'use client'

import { useEffect, useState } from 'react'
import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { StatusChip } from '@/components/status-chip'
import { getLocations, type ApiLocation } from '@/lib/api/shopInfo'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function ShopDetails({
  className,
  showName,
  location: initialLocation,
}: {
  className?: string
  showName?: boolean
  location?: ApiLocation | null
}) {
  const [loc, setLoc] = useState<ApiLocation | null>(initialLocation ?? null)

  useEffect(() => {
    if (initialLocation !== undefined) {
      setLoc(initialLocation)
      return
    }
    getLocations()
      .then((res) => {
        if (res.length > 0) setLoc(res[0])
      })
      .catch(() => {
        // Fallback to static site config
      })
  }, [initialLocation])

  const displayName = loc?.name || `${site.name} Sofia`
  const streetAddress = loc?.address || site.address.street
  const phoneText = loc?.phone || site.phone
  const phoneHref = `tel:${phoneText.replace(/\s+/g, '')}`

  const directionsUrl =
    loc?.latitude && loc?.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`
      : site.directionsUrl

  const hoursList = loc
    ? [
        {
          label: loc.workdays_text || 'Monday – Friday',
          value: loc.working_hours_weekdays || '09:30 – 19:30',
        },
        {
          label: 'Weekends',
          value: loc.working_hours_weekends || 'Closed',
        },
      ]
    : site.hours

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {showName && (
        <div className="flex flex-col gap-2">
          <StatusChip tone="success" dot>
            Open today
          </StatusChip>
          <h2 className="text-2xl font-bold tracking-tight text-navy">{displayName}</h2>
        </div>
      )}
      <ul className="flex flex-col gap-5">
        <li className="flex gap-4">
          <IconBox>
            <MapPin className="size-5" aria-hidden="true" />
          </IconBox>
          <div>
            <p className="font-semibold text-navy">{streetAddress}</p>
            <p className="text-sm text-muted-foreground">
              {loc ? 'Sofia, Bulgaria' : `${site.address.city} · ${site.address.area}`}
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <IconBox>
            <Phone className="size-5" aria-hidden="true" />
          </IconBox>
          <div>
            <a href={phoneHref} className="font-semibold text-navy hover:text-primary">
              {phoneText}
            </a>
            <p className="text-sm text-muted-foreground">Call or message on Viber</p>
          </div>
        </li>
        <li className="flex gap-4">
          <IconBox>
            <Clock className="size-5" aria-hidden="true" />
          </IconBox>
          <dl className="flex flex-1 flex-col gap-1.5">
            {hoursList.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 text-sm">
                <dt className="text-muted-foreground">{h.label}</dt>
                <dd
                  className={cn(
                    'font-semibold',
                    h.value.toLowerCase() === 'closed' ? 'text-destructive' : 'text-navy',
                  )}
                >
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      </ul>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}
        >
          <Navigation aria-hidden="true" />
          Get Directions
        </a>
        <a
          href={phoneHref}
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
        >
          <Phone aria-hidden="true" />
          Call Us
        </a>
      </div>
    </div>
  )
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
      {children}
    </span>
  )
}