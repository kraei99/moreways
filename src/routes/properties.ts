import { pool } from '../config/database';

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface PropertyTableItem {
  id: string;
  address: string;
  city: string;
  zipCode: string;
  totalValue: number;
  livingArea: number;
  bedrooms: number | null;          // Made nullable
  bathrooms: number | null;         // Made nullable
  yearBuilt: number | null;         // Made nullable
  propertyType: string;
  taxes: number | null;             // Made nullable
}

type PropertySearchResponse = PaginatedResponse<PropertyTableItem>;

export interface ZipCodeMarketData {
  regionId: number;
  region: number;
  metrics: {
    avgSaleToList: number;
    avgSaleToListMoM: number;
    avgSaleToListYoY: number;
    soldAboveList: number;
    soldAboveListMoM: number;
    soldAboveListYoY: number;
    offMarketInTwoWeeks: number;
    offMarketInTwoWeeksMoM: number;
    offMarketInTwoWeeksYoY: number;
  };
  parentMetroCode: number;
}

export interface MarketingStats {
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
}

export async function searchProperties(
  zipCode: string, 
  filters: PropertyFilters,
  page: number = 1,
  pageSize: number = 50
): Promise<PropertySearchResponse> {
  console.log('Searching properties with params:', { zipCode, filters, page, pageSize });
  
  const offset = (page - 1) * pageSize;
  
  // First, get total count
  const countQuery = `
    SELECT COUNT(*)
    FROM property_data p
    WHERE p.zip_code = $1::double precision
  `;
  
  // Main query with pagination
// In src/routes/properties.ts
  const queryStr = `
    SELECT 
      CAST(p.st_num AS text) as id,
      CONCAT(p.st_num::integer, ' ', p.st_name) as address,
      p.city,
      p.zip_code::text as zip_code,
      p.sale_price as total_value,
      p.living_area,
      NULL as bedrooms,                          -- These columns don't exist in the DB
      NULL as bathrooms,                         -- These columns don't exist in the DB
      NULL as year_built,                        -- This column doesn't exist in the DB
      p.lu_desc as property_type,
      NULL as taxes                              -- This column doesn't exist in the DB
    FROM property_data p
    WHERE p.zip_code = $1::double precision
  `;

  let finalQueryStr = queryStr;
  const queryParams: (string | number)[] = [zipCode];
  let paramCount = 2;

  if (filters.minPrice) {
    finalQueryStr += ` AND p.sale_price >= $${paramCount}::numeric`;
    queryParams.push(filters.minPrice.toString());
    paramCount++;
  }
  
  if (filters.maxPrice) {
    finalQueryStr += ` AND p.sale_price <= $${paramCount}::numeric`;
    queryParams.push(filters.maxPrice.toString());
    paramCount++;
  }

  finalQueryStr += ` ORDER BY p.sale_price DESC LIMIT $${paramCount}::integer OFFSET $${paramCount + 1}::integer`;
  queryParams.push(pageSize.toString(), offset.toString());

  try {
    console.log('Executing database queries...');
    const [countResult, propertiesResult] = await Promise.all([
      pool.query(countQuery, [zipCode]),
      pool.query(finalQueryStr, queryParams)
    ]);

    const total = parseInt(countResult.rows[0].count);
    console.log(`Found ${total} total properties matching criteria`);
    
    const items = propertiesResult.rows.map(row => ({
      id: row.id,
      address: row.address,
      city: row.city,
      zipCode: row.zip_code.padStart(5, '0'),
      totalValue: Number(row.total_value) || 0,
      livingArea: Number(row.living_area) || 0,
      bedrooms: row.bedrooms !== '0' ? Number(row.bedrooms) : null,
      bathrooms: row.bathrooms !== '0' ? Number(row.bathrooms) : null,
      yearBuilt: row.year_built !== '0' ? Number(row.year_built) : null,
      propertyType: row.property_type || 'Not specified',
      taxes: row.taxes !== '0' ? Number(row.taxes) : null
    }));
    
    console.log(`Successfully mapped ${items.length} properties for current page`);
    return {
      items,
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getZipCodeMarketData(zipCode: string): Promise<ZipCodeMarketData | null> {
  try {
    const query = `
      SELECT 
        regionid_x,
        region,
        avg_sale_to_list,
        avg_sale_to_list_mom,
        avg_sale_to_list_yoy,
        sold_above_list,
        sold_above_list_mom,
        sold_above_list_yoy,
        off_market_in_two_weeks,
        off_market_in_two_weeks_mom,
        off_market_in_two_weeks_yoy,
        parent_metro_region_metro_code
      FROM zip_code_data
      WHERE region = $1::integer
      LIMIT 1
    `;

    const result = await pool.query(query, [parseInt(zipCode)]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      regionId: row.regionid_x,
      region: row.region,
      metrics: {
        avgSaleToList: row.avg_sale_to_list || 0,
        avgSaleToListMoM: row.avg_sale_to_list_mom || 0,
        avgSaleToListYoY: row.avg_sale_to_list_yoy || 0,
        soldAboveList: row.sold_above_list || 0,
        soldAboveListMoM: row.sold_above_list_mom || 0,
        soldAboveListYoY: row.sold_above_list_yoy || 0,
        offMarketInTwoWeeks: row.off_market_in_two_weeks || 0,
        offMarketInTwoWeeksMoM: row.off_market_in_two_weeks_mom || 0,
        offMarketInTwoWeeksYoY: row.off_market_in_two_weeks_yoy || 0
      },
      parentMetroCode: row.parent_metro_region_metro_code
    };
  } catch (error) {
    console.error('Error fetching zip code market data:', error);
    throw error;
  }
}

export async function getMarketingStats(zipCode: string): Promise<MarketingStats> {
  try {
    // Get overview statistics
    const overviewQuery = `
      SELECT 
        zip_code,
        COUNT(*) as total_properties,
        AVG(sale_price) as avg_price,
        AVG(sale_price_per_sf) as avg_price_per_sqft,
        COUNT(CASE WHEN sale_price > 0 THEN 1 END) as total_sales
      FROM property_data
      WHERE zip_code = $1::double precision
      GROUP BY zip_code
    `;

    // Get property type statistics
    const propertyTypesQuery = `
      SELECT 
        lu_desc as property_type,
        COUNT(*) as type_count,
        AVG(sale_price) as avg_price
      FROM property_data
      WHERE zip_code = $1::double precision
        AND lu_desc IS NOT NULL
      GROUP BY lu_desc
      ORDER BY type_count DESC
    `;

    // Get building style statistics
    const buildingStylesQuery = `
      SELECT 
        building_style,
        COUNT(*) as style_count,
        AVG(sale_price) as avg_price
      FROM property_data
      WHERE zip_code = $1::double precision
        AND building_style IS NOT NULL
      GROUP BY building_style
      ORDER BY style_count DESC
    `;

    const [overviewResult, propertyTypesResult, buildingStylesResult] = await Promise.all([
      pool.query(overviewQuery, [zipCode]),
      pool.query(propertyTypesQuery, [zipCode]),
      pool.query(buildingStylesQuery, [zipCode])
    ]);

    const overview = overviewResult.rows[0] || {
      total_properties: 0,
      avg_price: 0,
      avg_price_per_sqft: 0,
      total_sales: 0
    };

    return {
      zipCode: parseInt(zipCode),
      overview: {
        totalProperties: parseInt(overview.total_properties),
        avgPrice: Math.round(overview.avg_price || 0),
        avgPricePerSqFt: Math.round(overview.avg_price_per_sqft || 0),
        totalSales: parseInt(overview.total_sales)
      },
      propertyTypes: propertyTypesResult.rows.map(row => ({
        type: row.property_type,
        count: parseInt(row.type_count),
        avgPrice: Math.round(row.avg_price || 0)
      })),
      buildingStyles: buildingStylesResult.rows.map(row => ({
        style: row.building_style,
        count: parseInt(row.style_count),
        avgPrice: Math.round(row.avg_price || 0)
      }))
    };
  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    throw error;
  }
}