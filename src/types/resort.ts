export interface Resort {
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
  verticalDrop: number
  totalRuns: number
  beginnerRuns: number
  intermediateRuns: number
  advancedRuns: number
  expertRuns: number
  totalLifts: number
  liftCapacity: number | null
  liftTypes: string[] | null
  adultTicketPrice: number | null
  childTicketPrice: number | null
  seasonPassPrice: number | null
  averageSnowfall: number | null
  snowmaking: boolean
  snowmakingAcres: number | null
  totalAcres: number | null
  skiableAcres: number | null
  terrainTypes: string[] | null
  amenities: string[] | null
  website: string | null
  phone: string | null
  address: string | null
  images: string[] | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ResortFilters {
  search?: string
  stateProvince?: string
  country?: string
  minBaseElevation?: number
  maxBaseElevation?: number
  minSummitElevation?: number
  maxSummitElevation?: number
  minRuns?: number
  maxRuns?: number
  minBeginnerRuns?: number
  maxBeginnerRuns?: number
  minIntermediateRuns?: number
  maxIntermediateRuns?: number
  minAdvancedRuns?: number
  maxAdvancedRuns?: number
  minExpertRuns?: number
  maxExpertRuns?: number
  minPrice?: number
  maxPrice?: number
  terrainTypes?: string[]
  amenities?: string[]
  snowmaking?: boolean
  sortBy?: 'name' | 'elevation' | 'runs' | 'price'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface WeatherForecast {
  current: {
    temperature: number
    condition: string
    windSpeed: number
    precipitation: number
  }
  daily: Array<{
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
    windSpeed: number
  }>
}

