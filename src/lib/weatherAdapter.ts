import type { WeatherResponse, AirQuality, ForecastDay, Alert as WeatherAlert } from '@/types/weather';
import type { GeoResponse, OneCallResponse, AirPollutionResponse } from '@/types/openweathermap';
import { format } from 'date-fns';

function mapAqi(owmAqi: number): number {
  // Maps OpenWeatherMap AQI (1-5) to US EPA Index (1-6)
  switch (owmAqi) {
    case 1: return 1; // Good
    case 2: return 2; // Fair -> Moderate
    case 3: return 3; // Moderate -> Unhealthy for sensitive
    case 4: return 4; // Poor -> Unhealthy
    case 5: return 5; // Very Poor -> Very Unhealthy
    default: return 1;
  }
}

export function adaptOpenWeatherData(
  geo: GeoResponse[0],
  weather: OneCallResponse,
  air: AirPollutionResponse
): WeatherResponse {

  const airQualityData = air.list[0];

  const adaptedAirQuality: AirQuality = {
    co: airQualityData.components.co,
    no2: airQualityData.components.no2,
    o3: airQualityData.components.o3,
    so2: airQualityData.components.so2,
    pm2_5: airQualityData.components.pm2_5,
    pm10: airQualityData.components.pm10,
    'us-epa-index': mapAqi(airQualityData.main.aqi),
    'gb-defra-index': 0, // Not provided by OWM
  };

  const adaptedForecast: ForecastDay[] = weather.daily.slice(0, 7).map(day => ({
    date: format(new Date(day.dt * 1000), 'yyyy-MM-dd'),
    date_epoch: day.dt,
    day: {
      maxtemp_c: day.temp.max,
      mintemp_c: day.temp.min,
      avgtemp_c: (day.temp.max + day.temp.min) / 2,
      maxwind_kph: day.wind_speed * 3.6, // m/s to km/h
      totalprecip_mm: day.rain || 0,
      totalsnow_cm: (day.snow || 0) / 10, // mm to cm
      avghumidity: day.humidity,
      daily_will_it_rain: day.pop > 0.3 ? 1: 0,
      daily_chance_of_rain: Math.round(day.pop * 100),
      daily_will_it_snow: day.snow && day.pop > 0.3 ? 1: 0,
      daily_chance_of_snow: day.snow ? Math.round(day.pop * 100) : 0,
      condition: {
        text: day.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
        code: day.weather[0].id,
      },
      uv: day.uvi,
      // These are not directly available per day from OWM in the same way
      maxtemp_f: 0,
      mintemp_f: 0,
      avgtemp_f: 0,
      maxwind_mph: 0,
      totalprecip_in: 0,
      avgvis_km: 0,
      avgvis_miles: 0,
    },
    astro: {
      sunrise: format(new Date(day.sunrise * 1000), 'h:mm a'),
      sunset: format(new Date(day.sunset * 1000), 'h:mm a'),
      moonrise: format(new Date(day.moonrise * 1000), 'h:mm a'),
      moonset: format(new Date(day.moonset * 1000), 'h:mm a'),
      moon_phase: '', // Can be calculated from moon_phase value if needed
      moon_illumination: '',
    },
    hour: [], // OWM One Call API doesn't provide full hourly for forecast days in free tier
  }));
  
  const adaptedAlerts: WeatherAlert[] = (weather.alerts || []).map(alert => ({
      headline: alert.event,
      msgtype: 'Alert',
      severity: 'Unknown',
      urgency: 'Unknown',
      areas: '',
      category: 'Met',
      certainty: 'Unknown',
      event: alert.event,
      note: '',
      effective: new Date(alert.start * 1000).toISOString(),
      expires: new Date(alert.end * 1000).toISOString(),
      desc: alert.description,
      instruction: '',
  }));


  const response: WeatherResponse = {
    location: {
      name: geo.name,
      region: geo.state || '',
      country: geo.country,
      lat: geo.lat,
      lon: geo.lon,
      tz_id: weather.timezone,
      localtime_epoch: weather.current.dt,
      localtime: format(new Date(weather.current.dt * 1000), "yyyy-MM-dd H:mm"),
    },
    current: {
      last_updated_epoch: weather.current.dt,
      last_updated: format(new Date(weather.current.dt * 1000), "yyyy-MM-dd H:mm"),
      temp_c: weather.current.temp,
      is_day: weather.current.dt > weather.current.sunrise && weather.current.dt < weather.current.sunset ? 1 : 0,
      condition: {
        text: weather.current.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
        code: weather.current.weather[0].id,
      },
      wind_kph: weather.current.wind_speed * 3.6, // m/s to km/h
      pressure_mb: weather.current.pressure,
      precip_mm: weather.current.rain?.['1h'] || 0,
      humidity: weather.current.humidity,
      cloud: weather.current.clouds,
      feelslike_c: weather.current.feels_like,
      vis_km: weather.current.visibility / 1000,
      uv: weather.current.uvi,
      gust_kph: (weather.current.wind_gust || 0) * 3.6, // m/s to km/h
      air_quality: adaptedAirQuality,
      // Dummy values for fields not provided by OWM
      temp_f: 0,
      wind_mph: 0,
      wind_degree: 0,
      wind_dir: '',
      pressure_in: 0,
      precip_in: 0,
      feelslike_f: 0,
      vis_miles: 0,
      gust_mph: 0,
    },
    forecast: {
      forecastday: adaptedForecast,
    },
    alerts: {
      alert: adaptedAlerts,
    },
    air_quality: adaptedAirQuality,
  };

  return response;
}
