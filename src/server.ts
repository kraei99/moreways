import express from 'express';
import cors from 'cors';
import { searchProperties, getMarketingStats } from './routes/properties';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Routes
app.get('/api/properties/search', async (req, res, next) => {
  try {
    console.log('Received property search request:', {
      query: req.query,
      headers: req.headers
    });
    
    const { 
      zipCode, 
      minPrice, 
      maxPrice,
      page = '1',
      pageSize = '50',
      sortBy = 'totalValue',
      sortOrder = 'desc'
    } = req.query;
    
    if (!zipCode) {
      console.log('Request rejected: Missing ZIP code');
      return res.status(400).json({ error: 'ZIP code is required' });
    }

    const filters = {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    console.log('Searching with filters:', {
      zipCode,
      filters,
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy,
      sortOrder
    });

    const result = await searchProperties(
      zipCode as string, 
      filters,
      Number(page),
      Number(pageSize)
    );
    
    console.log(`Search completed. Found ${result.total} properties`);
    res.json(result);
  } catch (error) {
    console.error('Error in property search endpoint:', error);
    next(error);
  }
});

// Marketing statistics endpoint
app.get('/api/market/:zipCode', async (_req, res, next) => {
  try {
    const { zipCode } = _req.params;
    
    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ error: 'Valid 5-digit ZIP code is required' });
    }

    const stats = await getMarketingStats(zipCode);
    res.json({
      success: true,
      data: stats,
      visualizations: {
        propertyTypes: {
          type: 'pie',
          data: stats.propertyTypes.map(type => ({
            label: type.type,
            value: type.count,
            avgPrice: type.avgPrice
          }))
        },
        buildingStyles: {
          type: 'bar',
          data: stats.buildingStyles.map(style => ({
            label: style.style,
            value: style.count,
            avgPrice: style.avgPrice
          }))
        },
        priceDistribution: {
          type: 'stats',
          data: {
            averagePrice: stats.overview.avgPrice,
            pricePerSqFt: stats.overview.avgPricePerSqFt,
            totalProperties: stats.overview.totalProperties,
            totalSales: stats.overview.totalSales
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Apply error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});