import type { WeatherResponse, WeatherError } from '@/types/weather';
import type { WeatherstackResponse, WeatherstackError } from '@/types/weatherstack';
import type { OpenWeatherMapCurrent, OpenWeatherMapForecast, OpenWeatherMapAirPollution, GeocodingResponse, OpenWeatherError } from '@/types/openweathermap';
import { adaptWeatherStackData, adaptOpenWeatherMapData } from './weatherAdapter';

const WEATHERAPI_API_KEY = '3f2f4f2c696d4f5e9d454009240204';
const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/forecast.json';

const WEATHERSTACK_API_KEY = '249dacc041049d7e001b18c6c3586752';
const WEATHERSTACK_URL = 'https://api.weatherstack.com/current';

const OPENWEATHERMAP_API_KEY = '53cd714a46de15e92f75e3948e4a93a5';
const OPENWEATHERMAP_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const OPENWEATHERMAP_REVERSE_GEO_URL = 'https://api.openweathermap.org/geo/1.0/reverse';
const OPENWEATHERMAP_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const OPENWEATHERMAP_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const OPENWEATHERMAP_AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';


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

async function getWeatherStackData(
  query: string
): Promise<WeatherResponse | WeatherError> {
  try {
    const response = await fetch(`${WEATHERSTACK_URL}?access_key=${WEATHERSTACK_API_KEY}&query=${query}`);
    const data = await response.json();

    if (data.success === false) {
      const errorData = data as WeatherstackError;
      return {
        error: {
          code: errorData.error.code,
          message: errorData.error.info,
        },
      };
    }
    
    return adaptWeatherStackData(data as WeatherstackResponse);

  } catch (error) {
     return {
      error: {
        code: -1, 
        message: 'Failed to fetch weather data from Weatherstack. Please check your network connection.',
      },
    };
  }
}

async function getOpenWeatherData(
  query: string
): Promise<WeatherResponse | WeatherError> {
  try {
    let lat: number;
    let lon: number;
    let geoData: GeocodingResponse;

    const isCoords = /^-?[\d.]+,[\d.]+$/.test(query);

    if (isCoords) {
      [lat, lon] = query.split(',').map(Number);
      const geoResponse = await fetch(`${OPENWEATHERMAP_REVERSE_GEO_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`);
      const geoResult = await geoResponse.json();
      if (!geoResponse.ok || geoResult.length === 0) throw new Error('Could not find location for coordinates.');
      geoData = geoResult[0];
    } else {
      const geoResponse = await fetch(`${OPENWEATHERMAP_GEO_URL}?q=${query}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`);
      const geoResult = await geoResponse.json();
      if (!geoResponse.ok || geoResult.length === 0) throw new Error(`City not found: ${query}`);
      geoData = geoResult[0];
      lat = geoData.lat;
      lon = geoData.lon;
    }

    const [currentResponse, forecastResponse, airResponse] = await Promise.all([
      fetch(`${OPENWEATHERMAP_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`),
      fetch(`${OPENWEATHERMAP_FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`),
      fetch(`${OPENWEATHERMAP_AIR_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok || !airResponse.ok) {
        const currentError: OpenWeatherError | null = !currentResponse.ok ? await currentResponse.json() : null;
        const forecastError: OpenWeatherError | null = !forecastResponse.ok ? await forecastResponse.json() : null;
        const airError: OpenWeatherError | null = !airResponse.ok ? await airResponse.json() : null;
        const errorMessage = currentError?.message || forecastError?.message || airError?.message || 'A request to OpenWeatherMap failed.';
        throw new Error(errorMessage);
    }
    
    const currentData: OpenWeatherMapCurrent = await currentResponse.json();
    const forecastData: OpenWeatherMapForecast = await forecastResponse.json();
    const airData: OpenWeatherMapAirPollution = await airResponse.json();
    
    return adaptOpenWeatherMapData(currentData, forecastData, airData, geoData);

  } catch (error: any) {
     return {
      error: {
        code: -1, 
        message: error.message || 'Failed to fetch weather data from OpenWeatherMap. Please check your network connection.',
      },
    };
  }
}


export async function getWeather(
  city: string,
  provider: 'weatherapi' | 'weatherstack' | 'openweathermap'
): Promise<WeatherResponse | WeatherError> {
  if (provider === 'weatherstack') {
    return getWeatherStackData(city);
  }
  if (provider === 'openweathermap') {
    return getOpenWeatherData(city);
  }
  return getWeatherApiData(city);
}
