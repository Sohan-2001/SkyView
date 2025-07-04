export interface WeatherTheme {
  image: string;
  aiHint: string;
}

// Weather condition codes from https://www.weatherapi.com/docs/weather_conditions.json
const weatherThemeMap: Record<number, { day: string; night: string; aiHint: string }> = {
  1000: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'clear sky' },
  1003: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'partly cloudy' },
  1006: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'cloudy sky' },
  1009: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'overcast sky' },
  1030: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'misty morning' },
  1063: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1066: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1072: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'drizzle rain' },
  1087: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'thunder storm' },
  1114: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'blowing snow' },
  1117: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'blizzard snow' },
  1135: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'foggy weather' },
  1147: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'freezing fog' },
  1150: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light drizzle' },
  1153: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light drizzle' },
  1168: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'freezing drizzle' },
  1171: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy drizzle' },
  1180: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'patchy rain' },
  1183: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1186: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1189: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1192: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1195: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1198: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light freezing' },
  1201: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy freezing' },
  1204: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light sleet' },
  1207: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy sleet' },
  1210: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'patchy snow' },
  1213: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1216: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate snow' },
  1219: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate snow' },
  1222: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1225: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1237: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1240: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1243: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1246: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1249: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light sleet' },
  1252: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy sleet' },
  1255: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1258: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1261: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1264: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1273: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light thunder' },
  1276: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy thunder' },
  1279: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light thunder' },
  1282: { day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy thunder' },
};

const defaultTheme: WeatherTheme = {
  image: 'https://placehold.co/1200x800',
  aiHint: 'weather abstract'
};

export function getWeatherTheme(weatherCode: number, isDay: number): WeatherTheme {
  const mapping = weatherThemeMap[weatherCode];
  if (!mapping) {
    return defaultTheme;
  }

  const imageName = isDay ? mapping.day : mapping.night;

  return {
    image: imageName,
    aiHint: mapping.aiHint,
  };
}
