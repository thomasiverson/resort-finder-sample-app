'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Mountain, SlidersHorizontal, DollarSign, Phone, Globe, Snowflake, CheckCircle2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import Link from 'next/link'

interface ResortDetailProps {
  resort: {
    name: string
    city: string
    stateProvince: string
    country: string
    baseElevation: number
    summitElevation: number
    verticalDrop: number
    totalRuns: number
    beginnerRuns: number
    intermediateRuns: number
    advancedRuns: number
    expertRuns: number
    totalLifts: number
    liftCapacity: number | null
    adultTicketPrice: number | null
    childTicketPrice: number | null
    seasonPassPrice: number | null
    averageSnowfall: number | null
    snowmaking: boolean
    totalAcres: number | null
    skiableAcres: number | null
    terrainTypes: string[] | null
    amenities: string[] | null
    website: string | null
    phone: string | null
    address: string | null
    description: string | null
  }
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export function ResortDetail({ resort }: ResortDetailProps) {
  const difficultyData = [
    { name: 'Beginner', value: resort.beginnerRuns, color: COLORS[0] },
    { name: 'Intermediate', value: resort.intermediateRuns, color: COLORS[1] },
    { name: 'Advanced', value: resort.advancedRuns, color: COLORS[2] },
    { name: 'Expert', value: resort.expertRuns, color: COLORS[3] },
  ].filter((item) => item.value > 0)

  const hasSnowcat = resort.amenities?.includes('snowcat') || false
  const hasNightSkiing = resort.amenities?.includes('night skiing') || false

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Elevation</div>
            </div>
            <div className="text-2xl font-bold">{resort.summitElevation.toLocaleString()} ft</div>
            <div className="text-xs text-muted-foreground">
              Base: {resort.baseElevation.toLocaleString()} ft
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Runs</div>
            </div>
            <div className="text-2xl font-bold">{resort.totalRuns}</div>
            <div className="text-xs text-muted-foreground">
              {resort.totalLifts} lifts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Snowflake className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Vertical Drop</div>
            </div>
            <div className="text-2xl font-bold">{resort.verticalDrop.toLocaleString()} ft</div>
            {resort.averageSnowfall && (
              <div className="text-xs text-muted-foreground">
                {resort.averageSnowfall}" avg snow
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Pricing</div>
            </div>
            {resort.adultTicketPrice ? (
              <>
                <div className="text-2xl font-bold">${resort.adultTicketPrice}</div>
                <div className="text-xs text-muted-foreground">Adult/day</div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Check website</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      {difficultyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terrain & Amenities */}
      <div className="grid md:grid-cols-2 gap-6">
        {resort.terrainTypes && resort.terrainTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Terrain Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resort.terrainTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {resort.amenities && resort.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resort.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="capitalize">{amenity}</span>
                    {amenity === 'snowcat' && (
                      <span className="text-xs text-muted-foreground">(Snowcat skiing available)</span>
                    )}
                    {amenity === 'night skiing' && (
                      <span className="text-xs text-muted-foreground">(Night skiing available)</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      {resort.description && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{resort.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resort.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <span>{resort.address}</span>
            </div>
          )}
          {resort.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <a href={`tel:${resort.phone}`} className="hover:underline">
                {resort.phone}
              </a>
            </div>
          )}
          {resort.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <Link
                href={resort.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

