'use client'

import { useState, useEffect } from 'react'
import { WeatherForecastComponent } from './WeatherForecast'
import type { WeatherForecast } from '@/types/resort'

interface WeatherForecastWrapperProps {
  latitude: number
  longitude: number
}

export function WeatherForecast({ latitude, longitude }: WeatherForecastWrapperProps) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
      .then((res) => res.json())
      .then((data) => {
        setForecast(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching weather:', error)
        setLoading(false)
      })
  }, [latitude, longitude])

  return <WeatherForecastComponent forecast={forecast} loading={loading} />
}

