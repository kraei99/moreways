import React from 'react';
import { PieChartData } from '@/lib/types/visualization';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PropertyTypeChartProps {
  data: PieChartData['data'];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FDB462', '#B3DE69', '#FCCDE5', '#BC80BD'
];

export function PropertyTypeChart({ data }: PropertyTypeChartProps) {
  // Take top 10 property types by count
  const chartData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((item, index) => ({
      name: item.label,
      value: item.value,
      avgPrice: item.avgPrice,
      color: COLORS[index % COLORS.length]
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: {new Intl.NumberFormat().format(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            Avg Price: {formatCurrency(data.avgPrice)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="text-lg font-semibold mb-4">Property Types Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate" title={entry.name}>
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
