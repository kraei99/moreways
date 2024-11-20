import React from 'react';
import { StatsData } from '@/lib/types/visualization';

interface MarketStatsProps {
  data: StatsData['data'];
}

export function MarketStats({ data }: MarketStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {formatCurrency(data.averagePrice)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Price per Sq Ft</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {formatCurrency(data.pricePerSqFt)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {formatNumber(data.totalProperties)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {formatNumber(data.totalSales)}
        </p>
      </div>
    </div>
  );
}
