export interface ChartDataPoint {
  label: string;
  value: number;
  avgPrice?: number;
}

export interface PieChartData {
  type: 'pie';
  data: ChartDataPoint[];
}

export interface BarChartData {
  type: 'bar';
  data: ChartDataPoint[];
}

export interface StatsData {
  type: 'stats';
  data: {
    averagePrice: number;
    pricePerSqFt: number;
    totalProperties: number;
    totalSales: number;
  };
}

export interface MarketVisualization {
  propertyTypes: PieChartData;
  buildingStyles: BarChartData;
  priceDistribution: StatsData;
}

export interface MarketResponse {
  success: boolean;
  data: {
    zipCode: number;
    overview: {
      totalProperties: number;
      avgPrice: number;
      avgPricePerSqFt: number;
      totalSales: number;
    };
    propertyTypes: {
      type: string;
      count: number;
      avgPrice: number;
    }[];
    buildingStyles: {
      style: string;
      count: number;
      avgPrice: number;
    }[];
  };
  visualizations: MarketVisualization;
}
