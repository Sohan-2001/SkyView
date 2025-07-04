"use client";

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import type { WeatherResponse, WeatherError } from '@/types/weather';
import { getWeather } from '@/lib/weather';
import { getWeatherTheme, type WeatherTheme } from '@/lib/weather-themes';
import WeatherDisplay from '@/components/WeatherDisplay';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, Snowflake, Zap, CloudDrizzle, Crosshair } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('New York');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [weatherTheme, setWeatherTheme] = useState<WeatherTheme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!searchQuery) return;
      setLoading(true);
      setError(null);
      const data = await getWeather(searchQuery);

      if (data && 'error' in data) {
        setError(data.error.message);
        setWeatherData(null);
        setWeatherTheme(null);
      } else if (data) {
        const weatherResponse = data as WeatherResponse;
        setWeatherData(weatherResponse);
        setLocation(weatherResponse.location.name);
        setWeatherTheme(getWeatherTheme(weatherResponse.current.condition.code, weatherResponse.current.is_day));
        setError(null);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [searchQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setSearchQuery(location);
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchQuery(`${latitude},${longitude}`);
        setLocation(''); // Clear city input field
      },
      (err) => {
        setLoading(false);
        setError(`Error: ${err.message}`);
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full transition-colors duration-500">
      {weatherTheme && (
        <Image 
          src={weatherTheme.image} 
          alt="Weather background" 
          fill
          style={{objectFit: "cover"}}
          className="z-0 transition-opacity duration-1000"
          data-ai-hint={weatherTheme.aiHint}
        />
      )}
      <div className="absolute inset-0 bg-black/20 z-1"></div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <div className="w-full max-w-lg text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-white drop-shadow-lg mb-2">SkyView</h1>
          <p className="text-lg text-white/90 drop-shadow-md mb-8">Your personal weather station</p>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name..."
              className="flex-grow bg-background/80 border-white/50 focus:bg-background/90"
              aria-label="City Name"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGeoLocation}
              disabled={loading}
              aria-label="Use current location"
            >
              <Crosshair className="h-4 w-4" />
            </Button>
          </form>

          {loading && (
            <div className="w-full max-w-lg">
              <div className="w-full max-w-lg animate-pulse">
                <Skeleton className="h-[320px] w-full rounded-lg bg-white/20" />
              </div>
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive" className="text-left animate-in fade-in-0 duration-500 bg-destructive/80 border-destructive-foreground/50 text-destructive-foreground">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {weatherData && !loading && <WeatherDisplay data={weatherData} />}

          {!loading && !error && !weatherData && (
             <div className="text-center text-white/80 mt-16 animate-in fade-in-50 duration-500">
               <p className="mb-4 drop-shadow-md">Enter a city to get the latest weather forecast.</p>
               <div className="flex justify-center gap-4 text-white drop-shadow-lg">
                  <Sun size={32} />
                  <Cloud size={32} />
                  <CloudDrizzle size={32} />
                  <Zap size={32} />
                  <Snowflake size={32} />
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
