export interface WeatherTheme {
  theme: string;
  image: string;
  aiHint: string;
}

// Weather condition codes from https://www.weatherapi.com/docs/weather_conditions.json
const weatherThemeMap: Record<number, { theme: string; day: string; night: string; aiHint: string }> = {
  1000: { theme: 'sunny', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'clear sky' },
  1003: { theme: 'cloudy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'partly cloudy' },
  1006: { theme: 'cloudy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'cloudy sky' },
  1009: { theme: 'cloudy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'overcast sky' },
  1030: { theme: 'fog', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'misty morning' },
  1063: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1066: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1072: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'drizzle rain' },
  1087: { theme: 'thunder', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'thunder storm' },
  1114: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'blowing snow' },
  1117: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'blizzard snow' },
  1135: { theme: 'fog', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'foggy weather' },
  1147: { theme: 'fog', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'freezing fog' },
  1150: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light drizzle' },
  1153: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light drizzle' },
  1168: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'freezing drizzle' },
  1171: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy drizzle' },
  1180: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'patchy rain' },
  1183: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1186: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1189: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1192: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1195: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1198: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light freezing' },
  1201: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy freezing' },
  1204: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light sleet' },
  1207: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy sleet' },
  1210: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'patchy snow' },
  1213: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1216: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate snow' },
  1219: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate snow' },
  1222: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1225: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1237: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1240: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light rain' },
  1243: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'moderate rain' },
  1246: { theme: 'rainy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy rain' },
  1249: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light sleet' },
  1252: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy sleet' },
  1255: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light snow' },
  1258: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy snow' },
  1261: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1264: { theme: 'snowy', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'ice pellets' },
  1273: { theme: 'thunder', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light thunder' },
  1276: { theme: 'thunder', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy thunder' },
  1279: { theme: 'thunder', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'light thunder' },
  1282: { theme: 'thunder', day: 'https://placehold.co/1200x800', night: 'https://placehold.co/1200x800', aiHint: 'heavy thunder' },
};

const defaultTheme: WeatherTheme = {
  theme: 'default',
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
    theme: mapping.theme,
    image: imageName,
    aiHint: mapping.aiHint,
  };
}
