'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Resort {
  id: string
  name: string
  city: string
  stateProvince: string
  latitude: number
  longitude: number
  totalRuns: number
  adultTicketPrice: number | null
}

interface ResortMapProps {
  resorts: Resort[]
}

function MapBounds({ resorts }: { resorts: Resort[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (resorts.length > 0) {
      const bounds = L.latLngBounds(
        resorts.map((r) => [r.latitude, r.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [resorts, map])

  return null
}

export function ResortMap({ resorts }: ResortMapProps) {
  if (resorts.length === 0) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">No resorts to display on map</p>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <MapContainer
        center={[39.5, -105.5]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds resorts={resorts} />
        {resorts.map((resort) => (
          <Marker
            key={resort.id}
            position={[resort.latitude, resort.longitude]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <Link href={`/resort/${resort.id}`} className="font-semibold hover:underline">
                  {resort.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {resort.city}, {resort.stateProvince}
                </p>
                <p className="text-sm">
                  {resort.totalRuns} runs
                  {resort.adultTicketPrice && ` • $${resort.adultTicketPrice}/day`}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  )
}

