'use client'

import dynamic from 'next/dynamic'

const DynamicResortMap = dynamic(() => import('./ResortMap').then((mod) => ({ default: mod.ResortMap })), {
  ssr: false,
  loading: () => <div className="h-[600px] flex items-center justify-center">Loading map...</div>,
})

interface ResortMapWrapperProps {
  resorts: Array<{
    id: string
    name: string
    city: string
    stateProvince: string
    latitude: number
    longitude: number
    totalRuns: number
    adultTicketPrice: number | null
  }>
}

export function ResortMapWrapper({ resorts }: ResortMapWrapperProps) {
  return <DynamicResortMap resorts={resorts} />
}

