
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CityData {
  city: string;
  latitude: number;
  longitude: number;
  depth_km: number;
  avg_magnitude: number;
  days_since_last_eq: number;
  risk_level: "High Risk" | "Medium Risk" | "Low Risk";
}

const earthquakeData: CityData[] = [
  { city: "Sapporo", latitude: 43.0618, longitude: 141.3545, depth_km: 55.3, avg_magnitude: 4.8, days_since_last_eq: 5, risk_level: "Medium Risk" },
  { city: "Sendai", latitude: 38.2682, longitude: 140.8694, depth_km: 60.1, avg_magnitude: 5.2, days_since_last_eq: 2, risk_level: "High Risk" },
  { city: "Tokyo", latitude: 35.6895, longitude: 139.6917, depth_km: 80.4, avg_magnitude: 5.0, days_since_last_eq: 1, risk_level: "Medium Risk" },
  { city: "Yokohama", latitude: 35.4437, longitude: 139.638, depth_km: 78.6, avg_magnitude: 4.9, days_since_last_eq: 1, risk_level: "Medium Risk" },
  { city: "Nagoya", latitude: 35.1815, longitude: 136.9066, depth_km: 50.7, avg_magnitude: 4.6, days_since_last_eq: 3, risk_level: "Medium Risk" },
  { city: "Osaka", latitude: 34.6937, longitude: 135.5023, depth_km: 45.2, avg_magnitude: 4.5, days_since_last_eq: 4, risk_level: "Medium Risk" },
  { city: "Kyoto", latitude: 35.0116, longitude: 135.7681, depth_km: 48.0, avg_magnitude: 4.4, days_since_last_eq: 6, risk_level: "Low Risk" },
  { city: "Kobe", latitude: 34.6901, longitude: 135.1956, depth_km: 70.2, avg_magnitude: 5.3, days_since_last_eq: 2, risk_level: "Medium Risk" },
  { city: "Hiroshima", latitude: 34.3853, longitude: 132.4553, depth_km: 42.8, avg_magnitude: 4.2, days_since_last_eq: 10, risk_level: "Low Risk" },
  { city: "Fukuoka", latitude: 33.5904, longitude: 130.4017, depth_km: 38.7, avg_magnitude: 4.3, days_since_last_eq: 12, risk_level: "Low Risk" },
  { city: "Kagoshima", latitude: 31.5966, longitude: 130.5571, depth_km: 60.9, avg_magnitude: 4.7, days_since_last_eq: 7, risk_level: "Low Risk" },
  { city: "Naha", latitude: 26.2124, longitude: 127.6809, depth_km: 45.5, avg_magnitude: 4.1, days_since_last_eq: 8, risk_level: "Low Risk" },
  { city: "Aomori", latitude: 40.8221, longitude: 140.7474, depth_km: 65.0, avg_magnitude: 4.9, days_since_last_eq: 5, risk_level: "Medium Risk" },
  { city: "Akita", latitude: 39.7200, longitude: 140.1025, depth_km: 63.3, avg_magnitude: 4.8, days_since_last_eq: 6, risk_level: "Medium Risk" },
  { city: "Niigata", latitude: 37.9162, longitude: 139.0364, depth_km: 67.2, avg_magnitude: 5.0, days_since_last_eq: 3, risk_level: "Medium Risk" },
  { city: "Toyama", latitude: 36.6953, longitude: 137.2113, depth_km: 72.6, avg_magnitude: 5.1, days_since_last_eq: 1, risk_level: "Medium Risk" },
  { city: "Nagano", latitude: 36.6513, longitude: 138.1810, depth_km: 68.4, avg_magnitude: 4.6, days_since_last_eq: 4, risk_level: "Medium Risk" },
  { city: "Shizuoka", latitude: 34.9756, longitude: 138.3828, depth_km: 52.7, avg_magnitude: 4.7, days_since_last_eq: 3, risk_level: "Medium Risk" },
  { city: "Matsue", latitude: 35.4723, longitude: 133.0505, depth_km: 41.3, avg_magnitude: 4.3, days_since_last_eq: 7, risk_level: "Low Risk" },
  { city: "Obihiro", latitude: 42.9232, longitude: 143.1960, depth_km: 60.5, avg_magnitude: 4.9, days_since_last_eq: 0, risk_level: "High Risk" }
];

export default function EarthquakePredictor() {
  const [cityName, setCityName] = useState("");
  const [result, setResult] = useState<CityData | null>(null);

  const handleSearch = () => {
    const found = earthquakeData.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    setResult(found || null);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk': return 'text-red-600';
      case 'Medium Risk': return 'text-yellow-600';
      case 'Low Risk': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Japan Earthquake Risk Predictor</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="city">Enter City Name:</Label>
          <Input id="city" value={cityName} onChange={e => setCityName(e.target.value)} placeholder="e.g. Tokyo" />
        </div>
        <Button onClick={handleSearch}>Predict Risk</Button>

        {result && (
          <Card className="mt-4">
            <CardContent className="space-y-2 p-4">
              <h2 className="text-xl font-semibold">{result.city}</h2>
              <p><strong>Latitude:</strong> {result.latitude}°</p>
              <p><strong>Longitude:</strong> {result.longitude}°</p>
              <p><strong>Depth of Last Earthquake Activity (km):</strong> {result.depth_km}</p>
              <p><strong>Average Magnitude:</strong> {result.avg_magnitude}</p>
              <p><strong>Days Since Last EQ:</strong> {result.days_since_last_eq}</p>
              <p className={`font-bold ${getRiskColor(result.risk_level)}`}>
                <strong>Risk Level:</strong> {result.risk_level}
              </p>
            </CardContent>
          </Card>
        )}

        {!result && cityName && (
          <p className="text-red-500 mt-4">City not found in dataset.</p>
        )}
      </div>
    </div>
  );
}
