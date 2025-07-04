import type { WeatherResponse, AirQuality, ForecastDay, Alert as WeatherAlert, Day } from '@/types/weather';
import type { WeatherstackResponse } from '@/types/weatherstack';
import { format } from 'date-fns';

export function adaptWeatherStackData(
  wsData: WeatherstackResponse
): WeatherResponse {

  const { location, current } = wsData;

  const adaptedAirQuality: AirQuality = {
    co: 0,
    no2: 0,
    o3: 0,
    so2: 0,
    pm2_5: 0,
    pm10: 0,
    'us-epa-index': 1, // Default to 'Good'
    'gb-defra-index': 0,
  };

  const todayForecast: Day = {
     maxtemp_c: current.temperature,
      mintemp_c: current.temperature,
      avgtemp_c: current.temperature,
      maxwind_kph: current.wind_speed,
      totalprecip_mm: current.precip,
      totalsnow_cm: 0,
      avghumidity: current.humidity,
      daily_will_it_rain: current.precip > 0 ? 1 : 0,
      daily_chance_of_rain: current.precip > 0 ? 100 : 0,
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: {
        text: current.weather_descriptions[0],
        icon: current.weather_icons[0],
        code: current.weather_code,
      },
      uv: current.uv_index,
      maxtemp_f: 0,
      mintemp_f: 0,
      avgtemp_f: 0,
      maxwind_mph: 0,
      totalprecip_in: 0,
      avgvis_km: current.visibility,
      avgvis_miles: 0,
  }

  const adaptedForecast: ForecastDay[] = [{
    date: format(new Date(location.localtime_epoch * 1000), 'yyyy-MM-dd'),
    date_epoch: location.localtime_epoch,
    day: todayForecast,
    astro: {
        sunrise: 'N/A',
        sunset: 'N/A',
        moonrise: 'N/A',
        moonset: 'N/A',
        moon_phase: 'N/A',
        moon_illumination: 'N/A',
    },
    hour: []
  }];

  const adaptedAlerts: WeatherAlert[] = [];


  const response: WeatherResponse = {
    location: {
      name: location.name,
      region: location.region,
      country: location.country,
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      tz_id: location.timezone_id,
      localtime_epoch: location.localtime_epoch,
      localtime: location.localtime,
    },
    current: {
      last_updated_epoch: location.localtime_epoch,
      last_updated: location.localtime,
      temp_c: current.temperature,
      is_day: current.is_day === 'yes' ? 1 : 0,
      condition: {
        text: current.weather_descriptions[0] || 'N/A',
        icon: current.weather_icons[0] || '',
        code: current.weather_code,
      },
      wind_kph: current.wind_speed,
      wind_dir: current.wind_dir,
      wind_degree: current.wind_degree,
      pressure_mb: current.pressure,
      precip_mm: current.precip,
      humidity: current.humidity,
      cloud: current.cloudcover,
      feelslike_c: current.feelslike,
      vis_km: current.visibility,
      uv: current.uv_index,
      air_quality: adaptedAirQuality,
      temp_f: 0,
      wind_mph: 0,
      pressure_in: 0,
      precip_in: 0,
      feelslike_f: 0,
      vis_miles: 0,
      gust_mph: 0,
      gust_kph: 0,
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
