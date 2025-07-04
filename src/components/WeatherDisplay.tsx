import type { WeatherResponse } from '@/types/weather';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  AlertTriangle,
  Leaf,
  CloudSun,
} from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherResponse;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { location, current, forecast, alerts, air_quality } = data;

  const getAqiDescription = (index: number) => {
    switch (index) {
      case 1: return 'Good';
      case 2: return 'Moderate';
      case 3: return 'Unhealthy for sensitive groups';
      case 4: return 'Unhealthy';
      case 5: return 'Very Unhealthy';
      case 6: return 'Hazardous';
      default: return 'Unknown';
    }
  };


  return (
    <div className="animate-in fade-in-0 duration-500 w-full max-w-lg">
      {alerts.alert.length > 0 && (
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="item-1" className="border-destructive/50 rounded-lg border">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">{alerts.alert.length} Active Weather Alert(s)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              {alerts.alert.map((alert, index) => (
                <div key={index} className="border-t border-destructive/50 pt-4 mt-4 first:mt-0 first:pt-0 first:border-t-0">
                  <h4 className="font-bold mb-1">{alert.event}</h4>
                  <p className="text-sm text-destructive">{alert.headline}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

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

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                 <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  <span>Visibility: {current.vis_km} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-accent" />
                  <span>UV Index: {current.uv}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="mt-4 text-left">
                <div className="space-y-2">
                  {forecast.forecastday.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Image src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} width={40} height={40} />
                        <div>
                          <p className="font-semibold">{format(new Date(day.date + 'T00:00:00'), 'eeee')}</p>
                          <p className="text-sm text-muted-foreground">{day.day.condition.text}</p>
                        </div>
                      </div>
                      <div className="text-right">
                          <p className="font-semibold">{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1"><Sunrise size={14}/> {day.astro.sunrise.replace(/^0/, '')}</div>
                              <div className="flex items-center gap-1"><Sunset size={14}/> {day.astro.sunset.replace(/^0/, '')}</div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
            </TabsContent>

            <TabsContent value="air-quality" className="mt-4 text-left">
              {air_quality ? (
                <div>
                   <div className="flex items-center gap-2 mb-4">
                     <Leaf className="w-5 h-5 text-accent" />
                     <span className="font-semibold">US EPA Index: {air_quality['us-epa-index']} ({getAqiDescription(air_quality['us-epa-index'])})</span>
                   </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">CO</p>
                      <p className="font-bold">{air_quality.co.toFixed(1)}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">NO₂</p>
                      <p className="font-bold">{air_quality.no2.toFixed(1)}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">O₃</p>
                      <p className="font-bold">{air_quality.o3.toFixed(1)}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">SO₂</p>
                      <p className="font-bold">{air_quality.so2.toFixed(1)}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">PM2.5</p>
                      <p className="font-bold">{air_quality.pm2_5.toFixed(1)}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">PM10</p>
                      <p className="font-bold">{air_quality.pm10.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Air quality data is not available for this location.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
