import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ResortFilters } from '@/types/resort'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters: ResortFilters = {
      search: searchParams.get('search') || undefined,
      stateProvince: searchParams.get('stateProvince') || undefined,
      country: searchParams.get('country') || undefined,
      minBaseElevation: searchParams.get('minBaseElevation') ? parseInt(searchParams.get('minBaseElevation')!) : undefined,
      maxBaseElevation: searchParams.get('maxBaseElevation') ? parseInt(searchParams.get('maxBaseElevation')!) : undefined,
      minSummitElevation: searchParams.get('minSummitElevation') ? parseInt(searchParams.get('minSummitElevation')!) : undefined,
      maxSummitElevation: searchParams.get('maxSummitElevation') ? parseInt(searchParams.get('maxSummitElevation')!) : undefined,
      minRuns: searchParams.get('minRuns') ? parseInt(searchParams.get('minRuns')!) : undefined,
      maxRuns: searchParams.get('maxRuns') ? parseInt(searchParams.get('maxRuns')!) : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      terrainTypes: searchParams.get('terrainTypes') ? searchParams.get('terrainTypes')!.split(',') : undefined,
      amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : undefined,
      snowmaking: searchParams.get('snowmaking') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'elevation' | 'runs' | 'price') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    }

    let where: any = {}

    // Text search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { stateProvince: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Location filters
    if (filters.stateProvince) {
      where.stateProvince = filters.stateProvince
    }
    if (filters.country) {
      where.country = filters.country
    }

    // Elevation filters
    if (filters.minBaseElevation !== undefined) {
      where.baseElevation = { ...where.baseElevation, gte: filters.minBaseElevation }
    }
    if (filters.maxBaseElevation !== undefined) {
      where.baseElevation = { ...where.baseElevation, lte: filters.maxBaseElevation }
    }
    if (filters.minSummitElevation !== undefined) {
      where.summitElevation = { ...where.summitElevation, gte: filters.minSummitElevation }
    }
    if (filters.maxSummitElevation !== undefined) {
      where.summitElevation = { ...where.summitElevation, lte: filters.maxSummitElevation }
    }

    // Run filters
    if (filters.minRuns !== undefined) {
      where.totalRuns = { ...where.totalRuns, gte: filters.minRuns }
    }
    if (filters.maxRuns !== undefined) {
      where.totalRuns = { ...where.totalRuns, lte: filters.maxRuns }
    }

    // Price filters
    if (filters.minPrice !== undefined) {
      where.adultTicketPrice = { ...where.adultTicketPrice, gte: filters.minPrice }
    }
    if (filters.maxPrice !== undefined) {
      where.adultTicketPrice = { ...where.adultTicketPrice, lte: filters.maxPrice }
    }

    // Snowmaking filter
    if (filters.snowmaking !== undefined) {
      where.snowmaking = filters.snowmaking
    }

    // Terrain types filter
    if (filters.terrainTypes && filters.terrainTypes.length > 0) {
      where.terrainTypes = {
        contains: filters.terrainTypes[0],
      }
    }

    // Amenities filter (including snowcat and night skiing)
    if (filters.amenities && filters.amenities.length > 0) {
      const amenityConditions = filters.amenities.map((amenity) => ({
        amenities: { contains: amenity },
      }))
      where.AND = amenityConditions
    }

    // Sort order
    let orderBy: any = {}
    switch (filters.sortBy) {
      case 'elevation':
        orderBy = { summitElevation: filters.sortOrder }
        break
      case 'runs':
        orderBy = { totalRuns: filters.sortOrder }
        break
      case 'price':
        orderBy = { adultTicketPrice: filters.sortOrder }
        break
      default:
        orderBy = { name: filters.sortOrder }
    }

    // Pagination
    const skip = ((filters.page || 1) - 1) * (filters.limit || 50)
    const take = filters.limit || 50

    const [resorts, total] = await Promise.all([
      db.resort.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      db.resort.count({ where }),
    ])

    // Parse JSON fields
    const parsedResorts = resorts.map((resort) => ({
      ...resort,
      liftTypes: resort.liftTypes ? JSON.parse(resort.liftTypes) : null,
      terrainTypes: resort.terrainTypes ? JSON.parse(resort.terrainTypes) : null,
      amenities: resort.amenities ? JSON.parse(resort.amenities) : null,
      images: resort.images ? JSON.parse(resort.images) : null,
    }))

    return NextResponse.json({
      resorts: parsedResorts,
      total,
      page: filters.page || 1,
      limit: filters.limit || 50,
      totalPages: Math.ceil(total / (filters.limit || 50)),
    })
  } catch (error) {
    console.error('Error fetching resorts:', error)
    return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 })
  }
}

