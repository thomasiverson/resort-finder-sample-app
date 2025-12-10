'use client'

import { useState, useEffect, useMemo } from 'react'
import { ResortFiltersComponent } from '@/components/ResortFilters'
import { ResortCard } from '@/components/ResortCard'
import { ResortMapWrapper } from '@/components/ResortMapWrapper'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LayoutGrid, List, Map } from 'lucide-react'
import Image from 'next/image'
import type { ResortFilters } from '@/types/resort'

interface Resort {
  id: string
  name: string
  slug: string
  city: string
  stateProvince: string
  country: string
  latitude: number
  longitude: number
  baseElevation: number
  summitElevation: number
  totalRuns: number
  adultTicketPrice: number | null
  images: string[] | null
}

export default function Home() {
  const [resorts, setResorts] = useState<Resort[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ResortFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'elevation' | 'runs' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [states, setStates] = useState<string[]>([])

  // Fetch unique states for filter dropdown
  useEffect(() => {
    fetch('/api/resorts?limit=1000')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const uniqueStates = Array.from(
          new Set((data.resorts || []).map((r: Resort) => r.stateProvince))
        ).sort() as string[]
        setStates(uniqueStates)
      })
      .catch((error) => {
        console.error('Error fetching states:', error)
        setStates([])
      })
  }, [])

  // Fetch resorts based on filters
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.stateProvince) params.append('stateProvince', filters.stateProvince)
    if (filters.country) params.append('country', filters.country)
    if (filters.minBaseElevation !== undefined) params.append('minBaseElevation', filters.minBaseElevation.toString())
    if (filters.maxBaseElevation !== undefined) params.append('maxBaseElevation', filters.maxBaseElevation.toString())
    if (filters.minSummitElevation !== undefined) params.append('minSummitElevation', filters.minSummitElevation.toString())
    if (filters.maxSummitElevation !== undefined) params.append('maxSummitElevation', filters.maxSummitElevation.toString())
    if (filters.minRuns !== undefined) params.append('minRuns', filters.minRuns.toString())
    if (filters.maxRuns !== undefined) params.append('maxRuns', filters.maxRuns.toString())
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.terrainTypes && filters.terrainTypes.length > 0) {
      params.append('terrainTypes', filters.terrainTypes[0])
    }
    if (filters.amenities && filters.amenities.length > 0) {
      params.append('amenities', filters.amenities.join(','))
    }
    if (filters.snowmaking !== undefined) params.append('snowmaking', filters.snowmaking.toString())
    
    params.append('sortBy', sortBy)
    params.append('sortOrder', sortOrder)
    params.append('limit', '100')

    fetch(`/api/resorts?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => {
            console.error('API Error:', err)
            throw new Error(err.error || `HTTP error! status: ${res.status}`)
          })
        }
        return res.json()
      })
      .then((data) => {
        console.log('Fetched resorts:', data.resorts?.length || 0, 'total:', data.total)
        setResorts(data.resorts || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching resorts:', error)
        setResorts([])
        setLoading(false)
      })
  }, [filters, sortBy, sortOrder])

  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/209955/pexels-photo-209955.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Snow-covered alpine mountains"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Resort Finder</h1>
          <p className="text-lg md:text-xl text-white/90">
            Discover your perfect destination across North America
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ResortFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              states={states}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="elevation">Elevation</SelectItem>
                    <SelectItem value="runs">Runs</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading resorts...</p>
              </div>
            ) : viewMode === 'map' ? (
              <ResortMapWrapper resorts={resorts} />
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Found {resorts.length} resort{resorts.length !== 1 ? 's' : ''}
                </div>
                {resorts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No resorts found matching your criteria.</p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {resorts.map((resort) => (
                      <ResortCard key={resort.id} resort={resort} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
