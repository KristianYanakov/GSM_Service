'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getLocations, type ApiLocation } from '@/lib/api/shopInfo'
import { site } from '@/lib/site'

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:44px;height:56px;transform:translate(-22px,-56px)">
    <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 55C22 55 42 34.5 42 21C42 9.95 33.05 1 22 1C10.95 1 2 9.95 2 21C2 34.5 22 55 22 55Z" fill="#e94560" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="22" cy="21" r="9" fill="#1a1a2e"/>
    </svg>
  </div>`,
  iconSize: [0, 0],
  popupAnchor: [0, -58],
})

function MapUpdater({ coords }: { coords: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(coords, map.getZoom())
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)
    return () => clearTimeout(timer)
  }, [map, coords])
  return null
}

export default function ShopMapInner({ interactive = true }: { interactive?: boolean }) {
  const [loc, setLoc] = useState<ApiLocation | null>(null)

  useEffect(() => {
    getLocations()
      .then((res) => {
        if (res.length > 0) setLoc(res[0])
      })
      .catch(() => {
        // Keep static coords
      })
  }, [])

  const coords: [number, number] =
    loc?.latitude && loc?.longitude
      ? [parseFloat(String(loc.latitude)), parseFloat(String(loc.longitude))]
      : site.coords

  const popupName = loc?.name || site.name
  const popupAddress = loc?.address || site.address.street

  return (
    <MapContainer
      center={coords}
      zoom={16}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      attributionControl
      className="size-full"
    >
      <MapUpdater coords={coords} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="shop-map-tiles"
      />
      <Marker position={coords} icon={pinIcon}>
        <Popup>
          <strong>{popupName}</strong>
          <br />
          {popupAddress}
        </Popup>
      </Marker>
    </MapContainer>
  )
}