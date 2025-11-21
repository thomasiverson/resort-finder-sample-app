'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, CloudRain, Snowflake, Sun, Wind } from 'lucide-react'
import { format } from 'date-fns'
import type { WeatherForecast } from '@/types/resort'

interface WeatherForecastProps {
  forecast: WeatherForecast | null
  loading?: boolean
}

function getWeatherIcon(condition: string) {
  const lower = condition.toLowerCase()
  if (lower.includes('snow')) return <Snowflake className="w-6 h-6" />
  if (lower.includes('rain')) return <CloudRain className="w-6 h-6" />
  if (lower.includes('cloud')) return <Cloud className="w-6 h-6" />
  return <Sun className="w-6 h-6" />
}

export function WeatherForecastComponent({ forecast, loading }: WeatherForecastProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading weather data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Weather data not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Conditions */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getWeatherIcon(forecast.current.condition)}
              <span className="font-semibold">Current Conditions</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(forecast.current.temperature)}°F</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Condition</div>
              <div className="font-medium">{forecast.current.condition}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Wind className="w-3 h-3" />
                Wind
              </div>
              <div className="font-medium">{Math.round(forecast.current.windSpeed)} mph</div>
            </div>
            <div>
              <div className="text-muted-foreground">Precipitation</div>
              <div className="font-medium">{forecast.current.precipitation.toFixed(1)} in</div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div>
          <h3 className="font-semibold mb-4">7-Day Forecast</h3>
          <div className="space-y-2">
            {forecast.daily.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {index === 0 ? 'Today' : format(new Date(day.date), 'EEEE')}
                    </div>
                    <div className="text-sm text-muted-foreground">{day.condition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{Math.round(day.high)}°</div>
                    <div className="text-sm text-muted-foreground">{Math.round(day.low)}°</div>
                  </div>
                  {day.precipitation > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {day.precipitation.toFixed(1)} in
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

