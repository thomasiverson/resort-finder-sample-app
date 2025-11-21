import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { MapPin, Mountain, SlidersHorizontal, DollarSign } from 'lucide-react'
import Image from 'next/image'

interface ResortCardProps {
  resort: {
    id: string
    name: string
    city: string
    stateProvince: string
    baseElevation: number
    summitElevation: number
    totalRuns: number
    adultTicketPrice: number | null
    images: string[] | null
  }
}

export function ResortCard({ resort }: ResortCardProps) {
  const imageUrl = resort.images && resort.images.length > 0 
    ? resort.images[0] 
    : 'https://images.unsplash.com/photo-1551524164-6cf77f5e7f8b?w=800'

  return (
    <Link href={`/resort/${resort.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={resort.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{resort.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{resort.city}, {resort.stateProvince}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <Mountain className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <div className="font-medium">{resort.summitElevation.toLocaleString()} ft</div>
                <div className="text-xs text-muted-foreground">Summit</div>
              </div>
            </div>
            <div className="flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <div className="font-medium">{resort.totalRuns}</div>
                <div className="text-xs text-muted-foreground">Runs</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {resort.adultTicketPrice && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="font-medium">${resort.adultTicketPrice}</span>
              <span className="text-muted-foreground ml-1">/day</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

