import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resort = await db.resort.findUnique({
      where: { id },
    })

    if (!resort) {
      return NextResponse.json({ error: 'Resort not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsedResort = {
      ...resort,
      liftTypes: resort.liftTypes ? JSON.parse(resort.liftTypes) : null,
      terrainTypes: resort.terrainTypes ? JSON.parse(resort.terrainTypes) : null,
      amenities: resort.amenities ? JSON.parse(resort.amenities) : null,
      images: resort.images ? JSON.parse(resort.images) : null,
    }

    return NextResponse.json(parsedResort)
  } catch (error) {
    console.error('Error fetching resort:', error)
    return NextResponse.json({ error: 'Failed to fetch resort' }, { status: 500 })
  }
}

