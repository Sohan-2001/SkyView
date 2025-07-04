import type { WeatherResponse, WeatherError } from '@/types/weather';

const API_KEY = '3f2f4f2c696d4f5e9d454009240204';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

export async function getWeather(
  city: string
): Promise<WeatherResponse | WeatherError> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no`);
    const data = await response.json();
    if (!response.ok) {
        return data as WeatherError;
    }
    return data as WeatherResponse;
  } catch (error) {
    return {
      error: {
        code: -1, 
        message: 'Failed to fetch weather data. Please check your network connection.',
      },
    };
  }
}
