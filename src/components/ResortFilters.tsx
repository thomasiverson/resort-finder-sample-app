'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import type { ResortFilters } from '@/types/resort'

interface ResortFiltersProps {
  filters: ResortFilters
  onFiltersChange: (filters: ResortFilters) => void
  states: string[]
}

export function ResortFiltersComponent({ filters, onFiltersChange, states }: ResortFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ResortFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const updateFilter = (key: keyof ResortFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const reset: ResortFilters = {}
    setLocalFilters(reset)
    onFiltersChange(reset)
  }

  const terrainTypes = ['Bowls', 'Glades', 'Parks', 'Groomed', 'Backcountry']
  const amenities = ['lodging', 'dining', 'parking', 'lessons', 'rentals', 'snowcat', 'night skiing']

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Resort name, city..."
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
          />
        </div>

        {/* State/Province */}
        <div className="space-y-2">
          <Label>State/Province</Label>
          <Select
            value={localFilters.stateProvince || 'all'}
            onValueChange={(value) => updateFilter('stateProvince', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Terrain Types */}
        <div className="space-y-2">
          <Label>Terrain Types</Label>
          <div className="space-y-2">
            {terrainTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`terrain-${type}`}
                  checked={localFilters.terrainTypes?.includes(type) || false}
                  onCheckedChange={(checked) => {
                    const current = localFilters.terrainTypes || []
                    const updated = checked
                      ? [...current, type]
                      : current.filter((t) => t !== type)
                    updateFilter('terrainTypes', updated.length > 0 ? updated : undefined)
                  }}
                />
                <Label htmlFor={`terrain-${type}`} className="cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={localFilters.amenities?.includes(amenity) || false}
                  onCheckedChange={(checked) => {
                    const current = localFilters.amenities || []
                    const updated = checked
                      ? [...current, amenity]
                      : current.filter((a) => a !== amenity)
                    updateFilter('amenities', updated.length > 0 ? updated : undefined)
                  }}
                />
                <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer capitalize">
                  {amenity}
                </Label>
              </div>
            ))}
            {/* Snowmaking */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="snowmaking"
                checked={localFilters.snowmaking || false}
                onCheckedChange={(checked) => updateFilter('snowmaking', checked || undefined)}
              />
              <Label htmlFor="snowmaking" className="cursor-pointer">
                Snowmaking Available
              </Label>
            </div>
          </div>
        </div>

        {/* Base Elevation */}
        <div className="space-y-2">
          <Label>Base Elevation: {localFilters.minBaseElevation || 0} - {localFilters.maxBaseElevation || 12000} ft</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minBaseElevation || ''}
              onChange={(e) => updateFilter('minBaseElevation', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxBaseElevation || ''}
              onChange={(e) => updateFilter('maxBaseElevation', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Summit Elevation */}
        <div className="space-y-2">
          <Label>Summit Elevation: {localFilters.minSummitElevation || 0} - {localFilters.maxSummitElevation || 14000} ft</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minSummitElevation || ''}
              onChange={(e) => updateFilter('minSummitElevation', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxSummitElevation || ''}
              onChange={(e) => updateFilter('maxSummitElevation', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Number of Runs */}
        <div className="space-y-2">
          <Label>Number of Runs: {localFilters.minRuns || 0} - {localFilters.maxRuns || 400}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minRuns || ''}
              onChange={(e) => updateFilter('minRuns', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxRuns || ''}
              onChange={(e) => updateFilter('maxRuns', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range: ${localFilters.minPrice || 0} - ${localFilters.maxPrice || 250}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min $"
              value={localFilters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max $"
              value={localFilters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

