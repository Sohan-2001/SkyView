"use client";

import { useState, useEffect, FormEvent } from 'react';
import type { WeatherResponse, WeatherError } from '@/types/weather';
import { getWeather } from '@/lib/weather';
import WeatherDisplay from '@/components/WeatherDisplay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, Snowflake, Zap, CloudDrizzle } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('New York');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
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
      } else if (data) {
        setWeatherData(data as WeatherResponse);
        setLocation( (data as WeatherResponse).location.name);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary mb-2">SkyView</h1>
        <p className="text-lg text-muted-foreground mb-8">Your personal weather station</p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name..."
            className="flex-grow"
            aria-label="City Name"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {loading && (
          <div className="w-full max-w-lg">
            <div className="w-full max-w-lg animate-pulse">
              <Skeleton className="h-[320px] w-full rounded-lg" />
            </div>
          </div>
        )}

        {error && !loading && (
          <Alert variant="destructive" className="text-left animate-in fade-in-0 duration-500">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {weatherData && !loading && <WeatherDisplay data={weatherData} />}

        {!loading && !error && !weatherData && (
           <div className="text-center text-muted-foreground mt-16 animate-in fade-in-50 duration-500">
             <p className="mb-4">Enter a city to get the latest weather forecast.</p>
             <div className="flex justify-center gap-4 text-primary">
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
  );
}
