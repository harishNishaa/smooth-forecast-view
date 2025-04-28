
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  location: string;
}

const Map = ({ location }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace this with your Mapbox token
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // Default to New York
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Update marker position when location changes
    if (location) {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`)
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
        .catch(error => console.error('Error fetching location:', error));
    }

    return () => {
      marker.current?.remove();
    };
  }, [location]);

  return (
    <div className="weather-card w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
