
import { toast } from "@/components/ui/use-toast";

const BASE_URL = 'http://api.weatherapi.com/v1';
const API_KEY = localStorage.getItem('weather_api_key');

export interface WeatherData {
  current: {
    location: string;
    temperature: number;
    condition: string;
    high: number;
    low: number;
    humidity: number;
    wind: number;
    feelsLike: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }>;
}

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    if (!API_KEY) {
      throw new Error('API key not found');
    }

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Transform API response to match our WeatherData interface
    return {
      current: {
        location: `${data.location.name}, ${data.location.country}`,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        high: data.forecast.forecastday[0].day.maxtemp_c,
        low: data.forecast.forecastday[0].day.mintemp_c,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        feelsLike: data.current.feelslike_c,
        visibility: data.current.vis_km,
        pressure: data.current.pressure_mb,
        uvIndex: data.current.uv,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
        day: new Date(day.date).toLocaleString('en-US', { weekday: 'short' }),
        high: day.day.maxtemp_c,
        low: day.day.mintemp_c,
        condition: day.day.condition.text,
        precipitation: day.day.daily_chance_of_rain
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
