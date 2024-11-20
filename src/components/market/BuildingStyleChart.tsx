import React from 'react';
import { BarChartData } from '@/lib/types/visualization';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BuildingStyleChartProps {
  data: BarChartData['data'];
}

export function BuildingStyleChart({ data }: BuildingStyleChartProps) {
  // Take top 10 building styles by count
  const chartData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map(item => ({
      name: item.label,
      count: item.value,
      avgPrice: item.avgPrice
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            Count: {new Intl.NumberFormat().format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Avg Price: {formatCurrency(payload[0].payload.avgPrice)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="text-lg font-semibold mb-4">Building Styles Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
