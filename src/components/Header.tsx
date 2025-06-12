
import React from 'react';
import { Globe, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Globe className="text-blue-300" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quickwatchguard</h1>
              <p className="text-blue-200 text-sm">Advanced Earthquake Risk Assessment</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Shield size={16} className="text-green-400" />
              <span>ML-Powered Predictions</span>
            </div>
            <div className="text-xs text-blue-200">
              Data Source: Japan Meteorological Agency
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
