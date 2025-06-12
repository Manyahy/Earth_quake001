
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Map, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface RiskMapProps {
  latitude: number | null;
  longitude: number | null;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

const RiskMap: React.FC<RiskMapProps> = ({ latitude, longitude, riskLevel }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [map, setMap] = useState<any>(null);

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return '#10b981'; // green
      case 'medium': return '#f59e0b'; // yellow
      case 'high': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const initializeMap = async () => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.default.accessToken = mapboxToken;

      const newMap = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [138.2529, 36.2048], // Center of Japan
        zoom: 5.5,
        projection: 'mercator'
      });

      // Add navigation controls
      newMap.addControl(
        new mapboxgl.default.NavigationControl(),
        'top-right'
      );

      // Japan earthquake risk zones (simplified)
      const riskZones = [
        { center: [139.6917, 35.6895], risk: 'high', name: 'Tokyo Region' },
        { center: [135.5023, 34.6937], risk: 'high', name: 'Osaka Region' },
        { center: [140.8694, 38.2682], risk: 'high', name: 'Sendai Region' },
        { center: [130.4017, 33.5904], risk: 'medium', name: 'Fukuoka Region' },
        { center: [136.9066, 35.1815], risk: 'medium', name: 'Nagoya Region' },
        { center: [132.4596, 34.3853], risk: 'low', name: 'Hiroshima Region' }
      ];

      newMap.on('load', () => {
        // Add risk zone circles
        riskZones.forEach((zone, index) => {
          const radius = zone.risk === 'high' ? 50000 : zone.risk === 'medium' ? 35000 : 25000;
          
          newMap.addSource(`risk-zone-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { risk: zone.risk },
              geometry: {
                type: 'Point',
                coordinates: zone.center
              }
            }
          });

          newMap.addLayer({
            id: `risk-zone-${index}`,
            type: 'circle',
            source: `risk-zone-${index}`,
            paint: {
              'circle-radius': {
                base: 1.75,
                stops: [
                  [5, radius / 10000],
                  [10, radius / 5000]
                ]
              },
              'circle-color': getRiskColor(zone.risk),
              'circle-opacity': 0.3,
              'circle-stroke-width': 2,
              'circle-stroke-color': getRiskColor(zone.risk),
              'circle-stroke-opacity': 0.8
            }
          });

          // Add risk zone labels
          newMap.addLayer({
            id: `risk-label-${index}`,
            type: 'symbol',
            source: `risk-zone-${index}`,
            layout: {
              'text-field': `${zone.name}\n${zone.risk.toUpperCase()} RISK`,
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 10,
              'text-transform': 'uppercase',
              'text-letter-spacing': 0.1,
              'text-offset': [0, 0],
              'text-anchor': 'center'
            },
            paint: {
              'text-color': getRiskColor(zone.risk),
              'text-halo-color': 'white',
              'text-halo-width': 1
            }
          });
        });

        // Add user location marker if coordinates are provided
        if (latitude && longitude) {
          addUserLocationMarker(newMap, longitude, latitude, riskLevel);
        }
      });

      setMap(newMap);
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addUserLocationMarker = (mapInstance: any, lng: number, lat: number, risk: string | null) => {
    // Remove existing user marker if it exists
    if (mapInstance.getSource('user-location')) {
      mapInstance.removeLayer('user-location-marker');
      mapInstance.removeSource('user-location');
    }

    // Add user location source
    mapInstance.addSource('user-location', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { risk: risk || 'unknown' },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    });

    // Add user location marker
    mapInstance.addLayer({
      id: 'user-location-marker',
      type: 'circle',
      source: 'user-location',
      paint: {
        'circle-radius': 8,
        'circle-color': getRiskColor(risk),
        'circle-stroke-width': 3,
        'circle-stroke-color': 'white'
      }
    });

    // Fly to user location
    mapInstance.flyTo({
      center: [lng, lat],
      zoom: 8,
      duration: 2000
    });
  };

  useEffect(() => {
    if (map && latitude && longitude) {
      addUserLocationMarker(map, longitude, latitude, riskLevel);
    }
  }, [latitude, longitude, riskLevel, map]);

  if (showTokenInput) {
    return (
      <div className="h-96 flex flex-col items-center justify-center p-6 space-y-4">
        <Map size={48} className="text-gray-400" />
        <div className="text-center space-y-4 max-w-sm">
          <h3 className="text-lg font-semibold text-gray-700">Setup Required</h3>
          <p className="text-sm text-gray-600">
            Enter your Mapbox public token to view the live risk map. Get your token from{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token" className="text-sm">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button 
            onClick={initializeMap}
            disabled={!mapboxToken.trim()}
            className="w-full"
          >
            Initialize Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96">
      <div ref={mapContainer} className="absolute inset-0 rounded-b-lg" />
      {latitude && longitude && riskLevel && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getRiskColor(riskLevel) }}
            />
            <span className="font-semibold capitalize">{riskLevel} Risk Area</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
