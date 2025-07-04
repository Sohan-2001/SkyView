import type { WeatherResponse, WeatherError } from '@/types/weather';
import type { WeatherstackResponse, WeatherstackError } from '@/types/weatherstack';
import { adaptWeatherStackData } from './weatherAdapter';

const WEATHERAPI_API_KEY = '3f2f4f2c696d4f5e9d454009240204';
const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/forecast.json';

const WEATHERSTACK_API_KEY = '249dacc041049d7e001b18c6c3586752';
const WEATHERSTACK_URL = 'http://api.weatherstack.com/current';

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


export async function getWeather(
  city: string,
  provider: 'weatherapi' | 'weatherstack'
): Promise<WeatherResponse | WeatherError> {
  if (provider === 'weatherstack') {
    return getWeatherStackData(city);
  }
  return getWeatherApiData(city);
}
