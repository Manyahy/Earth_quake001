
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateOptimizedPrediction, type OptimizedMLInput } from '@/services/optimizedMLPrediction';

interface EarthquakeZone {
  id: string;
  zone_name: string;
  prefecture: string;
  center_latitude: number;
  center_longitude: number;
  radius_km: number;
  risk_category: string;
  average_magnitude: number;
  last_major_earthquake: string | null;
}

interface EarthquakeData {
  id: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  location_name: string | null;
  prefecture: string | null;
  occurred_at: string;
}

export const useEarthquakeData = () => {
  const [zones, setZones] = useState<EarthquakeZone[]>([]);
  const [recentEarthquakes, setRecentEarthquakes] = useState<EarthquakeData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEarthquakeZones = async () => {
    try {
      const { data, error } = await supabase
        .from('earthquake_zones')
        .select('*')
        .order('risk_category', { ascending: false });

      if (error) throw error;
      setZones(data || []);
    } catch (error) {
      console.error('Error fetching earthquake zones:', error);
    }
  };

  const fetchRecentEarthquakes = async () => {
    try {
      const { data, error } = await supabase
        .from('earthquake_data')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentEarthquakes(data || []);
    } catch (error) {
      console.error('Error fetching recent earthquakes:', error);
    }
  };

  const generatePrediction = async (input: OptimizedMLInput) => {
    return await generateOptimizedPrediction(input);
  };

  const savePrediction = async (predictionData: {
    latitude: number;
    longitude: number;
    depth: number;
    magnitude: number;
    days_since_last: number;
    risk_level: string;
    confidence: number;
    prediction_details: string;
  }) => {
    try {
      const { error } = await supabase
        .from('risk_predictions')
        .insert([predictionData]);

      if (error) throw error;
      
      toast({
        title: "Prediction Saved",
        description: "Risk prediction saved to database"
      });
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchEarthquakeZones(),
      fetchRecentEarthquakes()
    ]).finally(() => setLoading(false));
  }, []);

  return {
    zones,
    recentEarthquakes,
    loading,
    generatePrediction,
    savePrediction,
    fetchEarthquakeZones,
    fetchRecentEarthquakes
  };
};
