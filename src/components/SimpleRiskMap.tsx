
import React from 'react';
import { MapPin } from 'lucide-react';

interface SimpleRiskMapProps {
  latitude: number | null;
  longitude: number | null;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

const SimpleRiskMap: React.FC<SimpleRiskMapProps> = ({ latitude, longitude, riskLevel }) => {
  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return '#10b981'; // green
      case 'medium': return '#f59e0b'; // yellow
      case 'high': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  // Convert lat/lng to SVG coordinates (simplified projection for Japan)
  const latLngToSVG = (lat: number, lng: number) => {
    // Japan bounds: lat 24-46, lng 129-146
    const x = ((lng - 129) / (146 - 129)) * 300 + 50;
    const y = ((46 - lat) / (46 - 24)) * 400 + 50;
    return { x, y };
  };

  // Get place name from coordinates (simplified for major cities/regions)
  const getPlaceName = (lat: number, lng: number) => {
    const locations = [
      { name: "Tokyo", lat: 35.6762, lng: 139.6503, range: 0.5 },
      { name: "Osaka", lat: 34.6937, lng: 135.5023, range: 0.4 },
      { name: "Kyoto", lat: 35.0116, lng: 135.7681, range: 0.3 },
      { name: "Yokohama", lat: 35.4437, lng: 139.6380, range: 0.3 },
      { name: "Nagoya", lat: 35.1815, lng: 136.9066, range: 0.4 },
      { name: "Sendai", lat: 38.2682, lng: 140.8694, range: 0.4 },
      { name: "Hiroshima", lat: 34.3853, lng: 132.4553, range: 0.3 },
      { name: "Fukuoka", lat: 33.5904, lng: 130.4017, range: 0.4 },
      { name: "Sapporo", lat: 43.0642, lng: 141.3469, range: 0.5 },
      { name: "Kumamoto", lat: 32.8031, lng: 130.7079, range: 0.3 },
      { name: "Kobe", lat: 34.6901, lng: 135.1956, range: 0.2 },
      { name: "Kanazawa", lat: 36.5944, lng: 136.6256, range: 0.3 },
      { name: "Niigata", lat: 37.9026, lng: 139.0232, range: 0.3 },
      { name: "Shizuoka", lat: 34.9756, lng: 138.3827, range: 0.3 },
      { name: "Matsuyama", lat: 33.8416, lng: 132.7656, range: 0.3 },
      { name: "Kagoshima", lat: 31.5966, lng: 130.5571, range: 0.3 },
      { name: "Naha", lat: 26.2124, lng: 127.6792, range: 0.3 },
    ];

    for (const location of locations) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
      );
      if (distance < location.range) {
        return location.name;
      }
    }

    // Determine region if not a major city
    if (lat >= 35.5 && lng >= 139 && lng <= 142) return "Kanto Region";
    if (lat >= 34 && lat <= 35.5 && lng >= 135 && lng <= 137) return "Kansai Region";
    if (lat >= 35 && lat <= 37.5 && lng >= 136 && lng <= 139) return "Chubu Region";
    if (lat >= 37.5 && lng >= 140) return "Tohoku Region";
    if (lat >= 32 && lat <= 34 && lng >= 129 && lng <= 132) return "Kyushu Region";
    if (lat >= 33.5 && lat <= 35 && lng >= 132 && lng <= 135) return "Chugoku Region";
    if (lat >= 33 && lat <= 34.5 && lng >= 134 && lng <= 135) return "Shikoku Region";
    if (lat >= 41.5) return "Hokkaido Region";
    if (lat <= 28) return "Okinawa Region";
    
    return "Japan";
  };

  // Generate dynamic seismic zones - these will use the actual prediction result for the specific location
  const generateSeismicZones = () => {
    const baseZones = [
      // High-risk zones based on historical seismic activity
      { name: "Nankai Trough", lat: 33.5, lng: 136, baseRisk: 'high', radius: 50 },
      { name: "Tokyo Metropolitan", lat: 35.6, lng: 139.7, baseRisk: 'high', radius: 35 },
      { name: "Kansai", lat: 34.7, lng: 135.4, baseRisk: 'medium', radius: 30 },
      { name: "Kumamoto", lat: 32.8, lng: 130.7, baseRisk: 'medium', radius: 25 },
      { name: "Central Honshu", lat: 36.2, lng: 138, baseRisk: 'low', radius: 35 },
      { name: "Northern Honshu", lat: 39.5, lng: 140.5, baseRisk: 'low', radius: 30 },
    ];

    // If we have a specific prediction for a location, update the zone risk dynamically
    if (latitude && longitude && riskLevel) {
      // Check if current location is within any existing zone and update its risk
      const updatedZones = baseZones.map(zone => {
        const distance = Math.sqrt(
          Math.pow(latitude - zone.lat, 2) + Math.pow(longitude - zone.lng, 2)
        );
        
        // If current location is within this zone's radius (scaled appropriately)
        if (distance < (zone.radius * 0.05)) { // Convert radius to degree approximation
          return { ...zone, baseRisk: riskLevel };
        }
        return zone;
      });

      // Add a specific zone for the current location if it's not covered by existing zones
      const isInExistingZone = baseZones.some(zone => {
        const distance = Math.sqrt(
          Math.pow(latitude - zone.lat, 2) + Math.pow(longitude - zone.lng, 2)
        );
        return distance < (zone.radius * 0.05);
      });

      if (!isInExistingZone) {
        const placeName = getPlaceName(latitude, longitude);
        updatedZones.push({
          name: placeName,
          lat: latitude,
          lng: longitude,
          baseRisk: riskLevel,
          radius: 25
        });
      }

      return updatedZones;
    }

    return baseZones;
  };

  const userLocation = latitude && longitude ? latLngToSVG(latitude, longitude) : null;
  const placeName = latitude && longitude ? getPlaceName(latitude, longitude) : null;
  const seismicZones = generateSeismicZones();

  return (
    <div className="relative h-96 bg-blue-50 rounded-b-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 500"
        className="absolute inset-0"
      >
        {/* Japan outline (simplified) */}
        <path
          d="M 180 80 Q 200 60 220 80 L 240 120 Q 250 140 260 160 L 280 200 Q 290 220 285 240 L 275 280 Q 270 300 260 320 L 240 360 Q 220 380 200 370 L 180 350 Q 160 330 150 310 L 140 270 Q 130 250 135 230 L 145 190 Q 155 170 165 150 L 175 110 Q 180 90 180 80 Z"
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="2"
        />
        
        {/* Honshu */}
        <path
          d="M 120 200 Q 140 180 160 190 L 200 210 Q 240 220 270 240 L 300 260 Q 320 280 310 300 L 290 320 Q 270 330 250 325 L 210 315 Q 170 305 140 285 L 120 265 Q 110 245 115 225 L 120 200 Z"
          fill="#f3f4f6"
          stroke="#9ca3af"
          strokeWidth="1"
        />

        {/* Dynamic seismic zones */}
        {seismicZones.map((zone, index) => {
          const pos = latLngToSVG(zone.lat, zone.lng);
          return (
            <g key={index}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={zone.radius}
                fill={getRiskColor(zone.baseRisk)}
                fillOpacity="0.2"
                stroke={getRiskColor(zone.baseRisk)}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={pos.x}
                y={pos.y - zone.radius - 5}
                textAnchor="middle"
                fontSize="8"
                fill={getRiskColor(zone.baseRisk)}
                fontWeight="bold"
              >
                {zone.name}
              </text>
            </g>
          );
        })}

        {/* User location marker */}
        {userLocation && (
          <g>
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="12"
              fill={getRiskColor(riskLevel)}
              stroke="white"
              strokeWidth="4"
            />
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="20"
              fill="none"
              stroke={getRiskColor(riskLevel)}
              strokeWidth="3"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="20;35;20"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Place name label */}
            <text
              x={userLocation.x}
              y={userLocation.y - 45}
              textAnchor="middle"
              fontSize="12"
              fill={getRiskColor(riskLevel)}
              fontWeight="bold"
            >
              {placeName}
            </text>
            {riskLevel && (
              <text
                x={userLocation.x}
                y={userLocation.y + 55}
                textAnchor="middle"
                fontSize="10"
                fill={getRiskColor(riskLevel)}
                fontWeight="bold"
              >
                {riskLevel.toUpperCase()} RISK
              </text>
            )}
          </g>
        )}

        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Location info overlay */}
      {latitude && longitude && riskLevel && placeName && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getRiskColor(riskLevel) }}
            />
            <span className="font-semibold">{placeName}</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </div>
          <div className="text-xs font-semibold mt-1" style={{ color: getRiskColor(riskLevel) }}>
            {riskLevel?.toUpperCase()} RISK ZONE
          </div>
        </div>
      )}

      {/* Legend */}
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

      {/* Map title */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin size={16} />
          AI Risk Assessment Map
        </div>
      </div>

      {/* No location message */}
      {!latitude || !longitude ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center">
            <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Enter coordinates to see AI risk assessment</p>
            <p className="text-gray-500 text-sm mt-1">Risk zones update based on ML predictions</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SimpleRiskMap;
