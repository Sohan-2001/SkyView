// Type definitions for OpenWeatherMap API responses

// Geo API Response: /geo/1.0/direct
export interface GeoResponse extends Array<GeoInfo> {}

export interface GeoInfo {
    name: string;
    local_names: { [key: string]: string };
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

// One Call API 3.0 Response: /data/3.0/onecall
export interface OneCallResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: Current;
    daily: Daily[];
    alerts?: Alert[];
}

export interface Current {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Weather[];
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface Daily {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: Temp;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Weather[];
    clouds: number;
    pop: number; // Probability of precipitation
    rain?: number;
    snow?: number;
    uvi: number;
}

export interface Temp {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

export interface FeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

export interface Alert {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
}

// Air Pollution API Response: /data/2.5/air_pollution
export interface AirPollutionResponse {
    coord: {
        lon: number;
        lat: number;
    };
    list: [
        {
            main: {
                aqi: number; // Air Quality Index. 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
            };
            components: {
                co: number;
                no: number;
                no2: number;
                o3: number;
                so2: number;
                pm2_5: number;
                pm10: number;
                nh3: number;
            };
            dt: number;
        }
    ];
}
