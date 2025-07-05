import type { WeatherResponse } from '@/types/weather';
import Image from 'next/image';
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
  
  const getIconSrc = (iconUrl: string) => {
    if (!iconUrl) return '';
    if (iconUrl.startsWith('//')) {
      return `https:${iconUrl}`;
    }
    return iconUrl;
  };


  return (
    <div className="animate-in fade-in-0 duration-500 w-full text-left">
      {alerts.alert.length > 0 && (
        <Accordion type="single" collapsible className="w-full mb-8">
          <AccordionItem value="item-1" className="border-destructive/50 rounded-lg border bg-destructive/10">
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
                  <p className="text-sm text-destructive/90">{alert.headline}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 p-6 rounded-lg bg-card text-card-foreground flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">{location.name}</h2>
            <p className="text-muted-foreground">{location.region}, {location.country}</p>
          </div>
          <div className="my-8">
            <p className="text-8xl font-bold text-primary">{Math.round(current.temp_c)}°C</p>
          </div>
          <div className="flex items-center gap-4">
             {current.condition.icon && (
                <Image
                  src={getIconSrc(current.condition.icon)}
                  alt={current.condition.text}
                  width={64}
                  height={64}
                />
              )}
            <p className="text-xl text-muted-foreground">{current.condition.text}</p>
          </div>
        </div>

        <div className="md:col-span-2">
            <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 p-6 rounded-lg bg-card text-card-foreground">
              <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-sm">Feels like</p>
                      <p className="font-bold text-lg">{Math.round(current.feelslike_c)}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-sm">Humidity</p>
                      <p className="font-bold text-lg">{current.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-sm">Wind</p>
                      <p className="font-bold text-lg">{current.wind_kph} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-sm">Pressure</p>
                      <p className="font-bold text-lg">{current.pressure_mb} mb</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-accent" />
                     <div>
                      <p className="text-muted-foreground text-sm">Visibility</p>
                      <p className="font-bold text-lg">{current.vis_km} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CloudSun className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-sm">UV Index</p>
                      <p className="font-bold text-lg">{current.uv}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="forecast" className="mt-0">
                  <div className="space-y-4">
                    {forecast.forecastday.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-4">
                          {day.day.condition.icon &&
                            <Image src={getIconSrc(day.day.condition.icon)} alt={day.day.condition.text} width={48} height={48} />
                          }
                          <div className="w-32">
                            <p className="font-semibold text-base">{format(new Date(day.date + 'T00:00:00'), 'eeee')}</p>
                            <p className="text-sm text-muted-foreground truncate">{day.day.condition.text}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-6">
                            <div className="hidden sm:flex gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5"><Sunrise size={16}/> {day.astro.sunrise.replace(/^0/, '')}</div>
                                <div className="flex items-center gap-1.5"><Sunset size={16}/> {day.astro.sunset.replace(/^0/, '')}</div>
                            </div>
                            <div className="text-right w-20">
                                <p className="font-bold text-lg">{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°</p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </TabsContent>

              <TabsContent value="air-quality" className="mt-0">
                {air_quality ? (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Leaf className="w-6 h-6 text-accent" />
                      <span className="font-semibold text-lg">US EPA Index: {air_quality['us-epa-index']} ({getAqiDescription(air_quality['us-epa-index'])})</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                      <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">CO</p>
                         <p className="font-bold text-lg">{air_quality.co.toFixed(1)}</p>
                      </div>
                       <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">NO₂</p>
                         <p className="font-bold text-lg">{air_quality.no2.toFixed(1)}</p>
                      </div>
                       <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">O₃</p>
                         <p className="font-bold text-lg">{air_quality.o3.toFixed(1)}</p>
                      </div>
                       <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">SO₂</p>
                         <p className="font-bold text-lg">{air_quality.so2.toFixed(1)}</p>
                      </div>
                       <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">PM2.5</p>
                         <p className="font-bold text-lg">{air_quality.pm2_5.toFixed(1)}</p>
                      </div>
                       <div className="flex items-center gap-3">
                         <p className="font-mono text-accent text-lg">PM10</p>
                         <p className="font-bold text-lg">{air_quality.pm10.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Air quality data is not available for this location.</p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
