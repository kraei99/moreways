import React, { useEffect, useState } from 'react';
import { MarketResponse } from '@/lib/types/visualization';
import { MarketStats } from './MarketStats';
import { PropertyTypeChart } from './PropertyTypeChart';
import { BuildingStyleChart } from './BuildingStyleChart';

interface MarketAnalysisProps {
  zipCode: string;
}

export function MarketAnalysis({ zipCode }: MarketAnalysisProps) {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/market/${zipCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (zipCode) {
      fetchMarketData();
    }
  }, [zipCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p className="font-medium">Error loading market data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">
          Market Analysis for {zipCode}
        </h2>
        <MarketStats data={data.visualizations.priceDistribution.data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <PropertyTypeChart data={data.visualizations.propertyTypes.data} />
        </div>
        <div className="bg-white rounded-lg shadow">
          <BuildingStyleChart data={data.visualizations.buildingStyles.data} />
        </div>
      </div>
    </div>
  );
}
