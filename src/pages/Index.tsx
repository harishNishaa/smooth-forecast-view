
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';

import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import WeatherForecast from '@/components/WeatherForecast';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherBackground from '@/components/WeatherBackground';
import { fetchWeatherData } from '@/services/weatherService';
import { mockWeatherData } from '@/data/mockWeatherData';

const Index = () => {
  const [location, setLocation] = useState('London');
  const [apiKey, setApiKey] = useState(localStorage.getItem('weather_api_key'));

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeatherData(location),
    enabled: !!apiKey,
    refetchInterval: 1800000, // Refetch every 30 minutes
    initialData: mockWeatherData
  });

  useEffect(() => {
    if (!apiKey) {
      const key = prompt('Please enter your WeatherAPI key:');
      if (key) {
        localStorage.setItem('weather_api_key', key);
        setApiKey(key);
        toast({
          title: "API Key Saved",
          description: "Your WeatherAPI key has been saved.",
        });
      }
    }
  }, [apiKey]);

  const handleSearch = (searchLocation: string) => {
    setLocation(searchLocation);
  };

  return (
    <>
      <WeatherBackground />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <Header onSearch={handleSearch} />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-8">
            Failed to load weather data. Please try again.
          </div>
        ) : weatherData && (
          <>
            <div className="mt-6">
              <CurrentWeather {...weatherData.current} />
            </div>
            
            <WeatherForecast forecasts={weatherData.forecast} />
            
            <WeatherDetails {...weatherData.current} />
          </>
        )}
      </div>
    </>
  );
};

export default Index;
