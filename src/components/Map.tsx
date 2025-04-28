
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";

interface MapProps {
  location: string;
}

const Map = ({ location }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get token from localStorage if available
    return localStorage.getItem('mapbox_token') || '';
  });
  const [isTokenSet, setIsTokenSet] = useState<boolean>(!!localStorage.getItem('mapbox_token'));

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
      toast({
        title: "Mapbox token saved",
        description: "Your Mapbox token has been saved for this session.",
      });
      // Reinitialize map with the new token
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map only once
    if (!map.current) {
      mapboxgl.accessToken = mapboxToken;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // Default to New York
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
  };

  useEffect(() => {
    if (isTokenSet) {
      initializeMap();
    }
  }, [isTokenSet]);

  useEffect(() => {
    if (!map.current || !isTokenSet || !location) return;

    // Update marker position when location changes
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          if (marker.current) {
            marker.current.remove();
          }
          
          marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current!);

          map.current?.flyTo({
            center: [lng, lat],
            zoom: 12,
            essential: true
          });
        }
      })
      .catch(error => {
        console.error('Error fetching location:', error);
        toast({
          title: "Location Error",
          description: "Unable to fetch location coordinates. Please check your Mapbox token.",
          variant: "destructive"
        });
      });

    return () => {
      marker.current?.remove();
    };
  }, [location, isTokenSet, mapboxToken]);

  if (!isTokenSet) {
    return (
      <div className="weather-card w-full p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">Mapbox API Token Required</h3>
        <p className="mb-4 text-sm text-center">
          To display the map, please enter your Mapbox public token. 
          You can get a free token at <a href="https://mapbox.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
        </p>
        <form onSubmit={handleTokenSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Enter your Mapbox token"
              className="border p-2 rounded w-full"
            />
            <button 
              type="submit"
              className="bg-primary text-white p-2 rounded hover:bg-primary/90 transition-colors"
            >
              Save Token
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="weather-card w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
