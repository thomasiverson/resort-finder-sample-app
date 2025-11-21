import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResortDetail } from '@/components/ResortDetail'
import { WeatherForecast } from '@/components/WeatherForecastWrapper'
import { ResortMapWrapper } from '@/components/ResortMapWrapper'
import { db } from '@/lib/db'

async function getResort(id: string) {
  const resort = await db.resort.findUnique({
    where: { id },
  })

  if (!resort) {
    return null
  }

  return {
    ...resort,
    liftTypes: resort.liftTypes ? JSON.parse(resort.liftTypes) : null,
    terrainTypes: resort.terrainTypes ? JSON.parse(resort.terrainTypes) : null,
    amenities: resort.amenities ? JSON.parse(resort.amenities) : null,
    images: resort.images ? JSON.parse(resort.images) : null,
  }
}

export default async function ResortPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resort = await getResort(id)

  if (!resort) {
    notFound()
  }

  const heroImage = resort.images && resort.images.length > 0 
    ? resort.images[0] 
    : 'https://images.pexels.com/photos/286581/pexels-photo-286581.jpeg?auto=compress&cs=tinysrgb&w=1200'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resorts
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <Image
          src={heroImage}
          alt={resort.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{resort.name}</h1>
          <div className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <span>
              {resort.city}, {resort.stateProvince}, {resort.country}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ResortDetail resort={resort} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WeatherForecast
              latitude={resort.latitude}
              longitude={resort.longitude}
            />
            <ResortMapWrapper
              resorts={[
                {
                  id: resort.id,
                  name: resort.name,
                  city: resort.city,
                  stateProvince: resort.stateProvince,
                  latitude: resort.latitude,
                  longitude: resort.longitude,
                  totalRuns: resort.totalRuns,
                  adultTicketPrice: resort.adultTicketPrice,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

