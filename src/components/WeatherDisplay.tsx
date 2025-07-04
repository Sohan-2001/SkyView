import type { WeatherResponse } from '@/types/weather';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Thermometer, Wind, Droplets, Gauge } from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherResponse;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { location, current } = data;

  return (
    <div className="animate-in fade-in-0 duration-500">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-left">{location.name}</CardTitle>
              <CardDescription className="text-left">{location.region}, {location.country}</CardDescription>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image
                src={`https:${current.condition.icon}`}
                alt={current.condition.text}
                width={64}
                height={64}
              />
              <p className="text-sm text-muted-foreground w-24">{current.condition.text}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mb-6 text-primary text-left">{Math.round(current.temp_c)}°C</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-accent" />
              <span>Feels like: {Math.round(current.feelslike_c)}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-accent" />
              <span>Humidity: {current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-accent" />
              <span>Wind: {current.wind_kph} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-accent" />
              <span>Pressure: {current.pressure_mb} mb</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
