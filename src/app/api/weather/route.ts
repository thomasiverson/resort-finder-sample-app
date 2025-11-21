import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
    }

    // Open-Meteo API (free, no API key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=7`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    // Transform Open-Meteo data to our format
    const forecast = {
      current: {
        temperature: data.daily.temperature_2m_max[0],
        condition: getWeatherCondition(data.daily.weathercode[0]),
        windSpeed: data.daily.windspeed_10m_max[0],
        precipitation: data.daily.precipitation_sum[0] || 0,
      },
      daily: data.daily.time.map((date: string, index: number) => ({
        date,
        high: data.daily.temperature_2m_max[index],
        low: data.daily.temperature_2m_min[index],
        condition: getWeatherCondition(data.daily.weathercode[index]),
        precipitation: data.daily.precipitation_sum[index] || 0,
        windSpeed: data.daily.windspeed_10m_max[index],
      })),
    }

    return NextResponse.json(forecast)
  } catch (error) {
    console.error('Error fetching weather:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0) return 'Clear'
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy'
  if (code === 45 || code === 48) return 'Foggy'
  if (code >= 51 && code <= 67) return 'Rainy'
  if (code >= 71 && code <= 77) return 'Snowy'
  if (code >= 80 && code <= 82) return 'Rain Showers'
  if (code >= 85 && code <= 86) return 'Snow Showers'
  if (code >= 95 && code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

