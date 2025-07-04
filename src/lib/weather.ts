import type { WeatherResponse, WeatherError } from '@/types/weather';
import type { GeoResponse, OneCallResponse, AirPollutionResponse } from '@/types/openweathermap';
import { adaptOpenWeatherData } from './weatherAdapter';

const WEATHERAPI_API_KEY = '3f2f4f2c696d4f5e9d454009240204';
const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/forecast.json';

const OPENWEATHER_API_KEY = '53cd714a46de15e92f75e3948e4a93a5';

async function getWeatherApiData(
  city: string
): Promise<WeatherResponse | WeatherError> {
  try {
    const response = await fetch(`${WEATHERAPI_URL}?key=${WEATHERAPI_API_KEY}&q=${city}&days=3&aqi=yes&alerts=yes`);
    const data = await response.json();
    if (!response.ok) {
        return data as WeatherError;
    }
    return data as WeatherResponse;
  } catch (error) {
    return {
      error: {
        code: -1, 
        message: 'Failed to fetch weather data from WeatherAPI. Please check your network connection.',
      },
    };
  }
}

async function getOpenWeatherData(
  city: string,
): Promise<WeatherResponse | WeatherError> {
  try {
    // 1. Geocode city to get lat/lon
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geoResponse = await fetch(geoUrl);
    const geoData: GeoResponse = await geoResponse.json();

    if (!geoResponse.ok || geoData.length === 0) {
      return { error: { code: 404, message: `Could not find location: ${city}` }};
    }
    const { lat, lon } = geoData[0];

    // 2. Fetch weather data using One Call API
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData: OneCallResponse = await weatherResponse.json();
     if (!weatherResponse.ok) {
      return { error: { code: weatherResponse.status, message: 'Failed to fetch weather data from OpenWeatherMap.' }};
    }

    // 3. Fetch air quality data
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
    const airResponse = await fetch(airUrl);
    const airData: AirPollutionResponse = await airResponse.json();
     if (!airResponse.ok) {
      return { error: { code: airResponse.status, message: 'Failed to fetch air quality data from OpenWeatherMap.' }};
    }

    // 4. Adapt data to our internal format
    return adaptOpenWeatherData(geoData[0], weatherData, airData);

  } catch (error) {
     return {
      error: {
        code: -1, 
        message: 'Failed to fetch weather data from OpenWeatherMap. Please check your network connection.',
      },
    };
  }
}

export async function getWeather(
  city: string,
  provider: 'weatherapi' | 'openweathermap'
): Promise<WeatherResponse | WeatherError> {
  if (provider === 'openweathermap') {
    return getOpenWeatherData(city);
  }
  return getWeatherApiData(city);
}
