"use client";

import { useState, useEffect, FormEvent } from 'react';
import type { WeatherResponse, WeatherError } from '@/types/weather';
import { getWeather } from '@/lib/weather';
import WeatherDisplay from '@/components/WeatherDisplay';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, Snowflake, Zap, CloudDrizzle, Crosshair, CloudSun, Layers, Cloudy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ApiProvider = 'weatherapi' | 'weatherstack' | 'openweathermap';

export default function Home() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('New York');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('weatherapi');
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      };
      setLoading(true);
      setError(null);
      const data = await getWeather(searchQuery, apiProvider);

      if (data && 'error' in data) {
        setError(data.error.message);
        setWeatherData(null);
      } else if (data) {
        const weatherResponse = data as WeatherResponse;
        setWeatherData(weatherResponse);
        setLocation(weatherResponse.location.name);
        setError(null);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [searchQuery, apiProvider]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setSearchQuery(location);
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleGeoLocation = () => {
    if (loading) return;
    
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchQuery(`${latitude},${longitude}`);
      },
      (err) => {
        setGeoError(`Failed to get location: ${err.message}. Please ensure location services are enabled for your browser.`);
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full">
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        <div className="w-full max-w-6xl pb-24">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground drop-shadow-lg mb-2 flex items-center justify-start gap-3">
              <CloudSun className="w-12 h-12" />
              SkyView
            </h1>
            <p className="text-base sm:text-lg text-foreground/90 drop-shadow-md mb-8">Your personal weather station</p>
          </div>
          
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl p-4 mb-8 shadow-lg">
            <form onSubmit={handleSubmit} className="flex-grow flex gap-2 w-full">
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city name..."
                className="flex-grow bg-transparent border-white/30 placeholder:text-foreground/60 focus:ring-offset-0 focus:border-white/80"
                aria-label="City Name"
              />
              <Button type="submit" disabled={loading} variant="secondary">
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGeoLocation}
                disabled={loading}
                aria-label="Use current location"
                className="bg-transparent border-white/30"
              >
                <Crosshair className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <AlertDialog open={!!geoError} onOpenChange={() => setGeoError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Location Error</AlertDialogTitle>
                <AlertDialogDescription>
                  {geoError}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setGeoError(null)}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {loading && (
             <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 flex flex-col gap-4 p-6 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl shadow-lg">
                      <div className="space-y-4">
                          <Skeleton className="h-10 w-3/4 rounded-md bg-white/20" />
                          <Skeleton className="h-6 w-1/2 rounded-md bg-white/20" />
                      </div>
                       <div className="space-y-4">
                          <Skeleton className="h-12 w-3/4 rounded-md bg-white/20" />
                      </div>
                       <div className="flex items-center gap-4">
                          <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
                          <Skeleton className="h-8 w-2/4 rounded-md bg-white/20" />
                      </div>
                  </div>
                  <div className="md:col-span-2 space-y-6 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl shadow-lg p-6">
                      <Skeleton className="h-10 w-full rounded-md bg-white/20" />
                      <div className="rounded-lg">
                          <Skeleton className="h-48 w-full rounded-md bg-white/20" />
                      </div>
                  </div>
              </div>
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive" className="text-left animate-in fade-in-0 duration-500 bg-destructive/20 backdrop-blur-lg border-destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {weatherData && !loading && <WeatherDisplay data={weatherData} />}

          {!loading && !error && !weatherData && (
             <div className="text-center text-foreground/80 mt-16 animate-in fade-in-50 duration-500">
               <p className="mb-4 drop-shadow-md">Enter a city to get the latest weather forecast.</p>
               <div className="flex justify-center gap-4 text-foreground drop-shadow-lg">
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
      <div className="fixed bottom-0 left-0 right-0 w-full border-t border-white/20 bg-background/30 backdrop-blur-xl z-50">
        <div className="flex justify-around items-center max-w-xl mx-auto p-2">
            <Button
              variant={apiProvider === 'weatherapi' ? 'secondary' : 'ghost'}
              className="flex flex-col h-auto p-2 rounded-lg"
              onClick={() => setApiProvider('weatherapi')}
            >
              <CloudSun className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">WeatherAPI</span>
            </Button>
            <Button
              variant={apiProvider === 'weatherstack' ? 'secondary' : 'ghost'}
              className="flex flex-col h-auto p-2 rounded-lg"
              onClick={() => setApiProvider('weatherstack')}
            >
              <Layers className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Weatherstack</span>
            </Button>
            <Button
              variant={apiProvider === 'openweathermap' ? 'secondary' : 'ghost'}
              className="flex flex-col h-auto p-2 rounded-lg"
              onClick={() => setApiProvider('openweathermap')}
            >
              <Cloudy className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">OpenWeatherMap</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
