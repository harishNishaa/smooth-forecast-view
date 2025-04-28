
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import WeatherForecast from '@/components/WeatherForecast';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherBackground from '@/components/WeatherBackground';
import { mockWeatherData } from '@/data/mockWeatherData';

const Index = () => {
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    toast({
      title: "Welcome to WeatherVue!",
      description: "View current weather and forecasts for your location.",
      duration: 5000
    });
  }, []);

  const handleSearch = (location: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Location updated",
        description: `Weather data loaded for ${location}`,
        duration: 3000
      });
      
      setWeatherData({
        ...weatherData,
        current: {
          ...weatherData.current,
          location: location
        }
      });
    }, 1000);
  };

  return (
    <>
      <WeatherBackground />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <Header onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <CurrentWeather 
                location={weatherData.current.location}
                temperature={weatherData.current.temperature}
                condition={weatherData.current.condition}
                high={weatherData.current.high}
                low={weatherData.current.low}
                humidity={weatherData.current.humidity}
                wind={weatherData.current.wind}
                feelsLike={weatherData.current.feelsLike}
              />
            </div>
            
            <WeatherForecast forecasts={weatherData.forecast} />
            
            <WeatherDetails 
              humidity={weatherData.current.humidity}
              wind={weatherData.current.wind}
              visibility={weatherData.current.visibility}
              pressure={weatherData.current.pressure}
              uvIndex={weatherData.current.uvIndex}
              sunrise={weatherData.current.sunrise}
              sunset={weatherData.current.sunset}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Index;
