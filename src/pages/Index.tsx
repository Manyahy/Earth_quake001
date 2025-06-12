import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import SimpleRiskMap from '@/components/SimpleRiskMap';
import { generateOptimizedPrediction, type OptimizedMLInput } from '@/services/optimizedMLPrediction';
import { languages } from '@/constants/languages';

const Index = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'jp'>('en');
  const t = languages[currentLang];
  
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    depth: '',
    daysSinceLastEarthquake: '',
    averagePastMagnitude: ''
  });

  const [prediction, setPrediction] = useState<{
    risk: 'low' | 'medium' | 'high';
    confidence: number;
    accuracy: number;
    details: string;
    processingTime: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const sampleLocations = [
    {
      name: "Tokyo (High Risk)",
      latitude: "35.6895",
      longitude: "139.6917", 
      depth: "80.4",
      daysSinceLastEarthquake: "1",
      averagePastMagnitude: "6.2"
    },
    {
      name: t.samples.sapporo,
      latitude: "43.0618",
      longitude: "141.3545",
      depth: "55.3", 
      daysSinceLastEarthquake: "5",
      averagePastMagnitude: "4.8"
    },
    {
      name: t.samples.hiroshima,
      latitude: "34.3853",
      longitude: "132.4553",
      depth: "42.8",
      daysSinceLastEarthquake: "10", 
      averagePastMagnitude: "4.2"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadSampleData = (sample: typeof sampleLocations[0]) => {
    setFormData({
      latitude: sample.latitude,
      longitude: sample.longitude,
      depth: sample.depth,
      daysSinceLastEarthquake: sample.daysSinceLastEarthquake,
      averagePastMagnitude: sample.averagePastMagnitude
    });
    
    toast({
      title: currentLang === 'en' ? "Sample Data Loaded" : "サンプルデータ読込完了",
      description: currentLang === 'en' ? `Loaded coordinates for ${sample.name}` : `座標データを読み込みました ${sample.name}`,
    });
  };

  const validateJapanCoordinates = (lat: number, lng: number) => {
    return lat >= 24 && lat <= 46 && lng >= 129 && lng <= 146;
  };

  const handlePredict = async () => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    const depth = parseFloat(formData.depth);
    const days = parseInt(formData.daysSinceLastEarthquake);
    const magnitude = parseFloat(formData.averagePastMagnitude);

    if (isNaN(lat) || isNaN(lng) || isNaN(depth) || isNaN(days) || isNaN(magnitude)) {
      toast({
        title: currentLang === 'en' ? "Invalid Input" : "入力エラー",
        description: currentLang === 'en' ? "Please enter valid numeric values for all fields." : "すべての項目に有効な数値を入力してください",
        variant: "destructive"
      });
      return;
    }

    if (!validateJapanCoordinates(lat, lng)) {
      toast({
        title: currentLang === 'en' ? "Location Error" : "位置エラー",
        description: currentLang === 'en' ? "Please enter coordinates within Japan's boundaries." : "日本国内の座標を入力してください",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const mlInput: OptimizedMLInput = {
        latitude: lat,
        longitude: lng,
        depth,
        magnitude,
        daysSinceLastEq: days
      };
      
      const result = await generateOptimizedPrediction(mlInput);
      setPrediction(result);
      
      toast({
        title: t.predictionComplete,
        description: `${t.riskDetected}: ${result.risk.toUpperCase()} (${result.accuracy}% accuracy)`,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, #FFE8E6, #FFF4E6, #FFFACD)` }}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setCurrentLang('en')}
              variant={currentLang === 'en' ? 'default' : 'outline'}
              size="sm"
            >
              English
            </Button>
            <Button
              onClick={() => setCurrentLang('jp')}
              variant={currentLang === 'jp' ? 'default' : 'outline'}
              size="sm"
            >
              日本語
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Activity style={{ color: '#FF5C4D' }} size={40} />
            🤖 {t.title}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {t.subtitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {t.description}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              🤖 {t.mlModelActive}
            </div>
          </div>
        </div>

        {/* Vertical Layout */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Location Parameters */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader style={{ background: `linear-gradient(135deg, #FF9636, #FFCD58)` }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin size={24} />
                {t.locationParams}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Sample Data Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">{t.sampleLocations}</Label>
                <div className="grid gap-2">
                  {sampleLocations.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleData(sample)}
                      className="justify-start text-xs hover:bg-orange-50 border-orange-200"
                    >
                      {sample.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">{t.latitude} (degrees)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 35.6762"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">{t.longitude} (degrees)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 139.6503"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">{t.depth} (km)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">{t.daysSince}</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.daysSinceLastEarthquake}
                    onChange={(e) => handleInputChange('daysSinceLastEarthquake', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700">{t.avgMagnitude}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.2"
                    value={formData.averagePastMagnitude}
                    onChange={(e) => handleInputChange('averagePastMagnitude', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full py-3 text-white font-semibold rounded-lg"
                style={{ background: `linear-gradient(135deg, #FF5C4D, #FF9636)` }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t.analyzing}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Activity size={20} />
                    {t.predictRisk}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Risk Map */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader style={{ background: `linear-gradient(135deg, #DAD870, #FFCD58)` }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin size={24} />
                {t.riskMap}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SimpleRiskMap 
                latitude={parseFloat(formData.latitude) || null}
                longitude={parseFloat(formData.longitude) || null}
                riskLevel={prediction?.risk || null}
              />
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader style={{ background: `linear-gradient(135deg, #FF5C4D, #FF9636)` }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={24} />
                {t.riskAssessment}
                {prediction && (
                  <Badge className="bg-white/20 text-white">
                    {prediction.accuracy}% Accuracy
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {prediction ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Badge 
                      className="text-lg px-6 py-2 text-white font-bold mb-4"
                      style={{ 
                        backgroundColor: 
                          prediction.risk === 'high' ? '#FF5C4D' : 
                          prediction.risk === 'medium' ? '#FFCD58' : '#DAD870' 
                      }}
                    >
                      {prediction.risk === 'high' ? t.highRisk : 
                       prediction.risk === 'medium' ? t.mediumRisk : t.lowRisk}
                    </Badge>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{prediction.confidence}%</div>
                        <div className="text-sm text-gray-600">{t.confidence}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{prediction.accuracy}%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{prediction.processingTime}ms</div>
                        <div className="text-sm text-gray-600">Speed</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Precautionary Steps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      📋 {t.recommendations}
                    </h4>
                    <div className="space-y-2">
                      {t.precautions[prediction.risk].map((step, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-xs mt-1">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">{t.emergencyContacts}</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>🚨 Emergency: 110 (Police) / 119 (Fire/Medical)</p>
                      <p>📱 Earthquake Early Warning: NHK World, Yahoo! Japan</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>{currentLang === 'en' ? 'Enter location data to begin analysis' : '位置データを入力して分析を開始してください'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
