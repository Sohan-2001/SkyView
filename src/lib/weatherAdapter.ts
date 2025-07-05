import type { WeatherResponse, AirQuality, ForecastDay, Alert as WeatherAlert, Day } from '@/types/weather';
import type { WeatherstackResponse } from '@/types/weatherstack';
import type { OpenWeatherMapCurrent, OpenWeatherMapForecast, OpenWeatherMapAirPollution, GeocodingResponse } from '@/types/openweathermap';
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

export function adaptOpenWeatherMapData(
  currentData: OpenWeatherMapCurrent,
  forecastData: OpenWeatherMapForecast,
  airData: OpenWeatherMapAirPollution,
  geoData: GeocodingResponse,
): WeatherResponse {
  
  const dailyForecasts: { [key: string]: any } = {};

  forecastData.list.forEach(item => {
    const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        weather: [],
        wind_speeds: [],
        precip_chance: [],
        humidities: [],
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].weather.push(item.weather[0]);
    dailyForecasts[date].wind_speeds.push(item.wind.speed);
    dailyForecasts[date].precip_chance.push(item.pop);
    dailyForecasts[date].humidities.push(item.main.humidity);
  });

  const adaptedForecastDays: ForecastDay[] = Object.keys(dailyForecasts).slice(0, 3).map(date => {
    const dayData = dailyForecasts[date];
    const avgTemp = dayData.temps.reduce((a: number, b: number) => a + b, 0) / dayData.temps.length;
    
    const weatherCounts: {[key: string]: number} = {};
    dayData.weather.forEach((w: any) => {
      weatherCounts[w.description] = (weatherCounts[w.description] || 0) + 1;
    });
    const mostCommonWeatherDesc = Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);
    const mostCommonWeather = dayData.weather.find((w: any) => w.description === mostCommonWeatherDesc);

    const day: Day = {
      maxtemp_c: Math.max(...dayData.temps),
      mintemp_c: Math.min(...dayData.temps),
      avgtemp_c: avgTemp,
      maxwind_kph: Math.max(...dayData.wind_speeds) * 3.6, // m/s to km/h
      totalprecip_mm: 0,
      daily_chance_of_rain: Math.max(...dayData.precip_chance) * 100,
      avghumidity: dayData.humidities.reduce((a: number, b: number) => a + b, 0) / dayData.humidities.length,
      condition: {
        text: mostCommonWeather.description,
        icon: `https://openweathermap.org/img/wn/${mostCommonWeather.icon}@2x.png`,
        code: mostCommonWeather.id,
      },
      uv: 0,
      maxtemp_f: 0, mintemp_f: 0, avgtemp_f: 0, maxwind_mph: 0, totalprecip_in: 0, totalsnow_cm: 0,
      avgvis_km: 0, avgvis_miles: 0, daily_will_it_rain: 0, daily_will_it_snow: 0, daily_chance_of_snow: 0,
    };
    
    return {
      date: date,
      date_epoch: new Date(date + 'T00:00:00').getTime() / 1000,
      day: day,
      astro: {
        sunrise: format(new Date(forecastData.city.sunrise * 1000), 'hh:mm a'),
        sunset: format(new Date(forecastData.city.sunset * 1000), 'hh:mm a'),
        moonrise: 'N/A', moonset: 'N/A', moon_phase: 'N/A', moon_illumination: 'N/A'
      },
      hour: [],
    };
  });

  const adaptedAirQuality: AirQuality = {
    co: airData.list[0].components.co, no2: airData.list[0].components.no2, o3: airData.list[0].components.o3,
    so2: airData.list[0].components.so2, pm2_5: airData.list[0].components.pm2_5, pm10: airData.list[0].components.pm10,
    'us-epa-index': airData.list[0].main.aqi, 'gb-defra-index': 0,
  };

  const response: WeatherResponse = {
    location: {
      name: geoData.name,
      region: geoData.state || geoData.country,
      country: geoData.country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon,
      tz_id: currentData.timezone.toString(),
      localtime_epoch: currentData.dt,
      localtime: format(new Date(currentData.dt * 1000), 'yyyy-MM-dd HH:mm'),
    },
    current: {
      last_updated_epoch: currentData.dt,
      last_updated: format(new Date(currentData.dt * 1000), 'yyyy-MM-dd HH:mm'),
      temp_c: currentData.main.temp,
      is_day: currentData.weather[0].icon.includes('d') ? 1 : 0,
      condition: {
        text: currentData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        code: currentData.weather[0].id,
      },
      wind_kph: currentData.wind.speed * 3.6,
      wind_degree: currentData.wind.deg,
      wind_dir: 'N/A',
      pressure_mb: currentData.main.pressure,
      precip_mm: 0,
      humidity: currentData.main.humidity,
      cloud: currentData.clouds.all,
      feelslike_c: currentData.main.feels_like,
      vis_km: currentData.visibility / 1000,
      uv: 0,
      air_quality: adaptedAirQuality,
      temp_f: 0, wind_mph: 0, pressure_in: 0, precip_in: 0, feelslike_f: 0, vis_miles: 0, gust_mph: 0, gust_kph: 0,
    },
    forecast: {
      forecastday: adaptedForecastDays,
    },
    alerts: {
      alert: [],
    },
    air_quality: adaptedAirQuality,
  };

  return response;
}
