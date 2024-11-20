import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { usePropertySearch } from '@/hooks/useProperties';
import { PropertySearchParams } from '@/lib/types/property';

export default function MarketingPage() {
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    sortBy: 'totalValue',
    sortOrder: 'desc'
  });

  const { data, isLoading } = usePropertySearch(searchParams);
  const properties = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const resultsPerPage = data?.pageSize ?? 50;

  const handleZipCodeSearch = (zipCode: string) => {
    setSearchParams(prev => ({
      ...prev,
      zipCode,
      page: 1
    }));
  };

  const handleSort = (field: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: field as any,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Property Search</h1>
        <div className="w-full max-w-md">
          <Input
            placeholder="Enter ZIP Code (e.g., 02114)"
            value={searchParams.zipCode || ''}
            onChange={(e) => handleZipCodeSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {searchParams.zipCode && (
        <>
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No properties found for ZIP code {searchParams.zipCode}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('totalValue')}
                    >
                      Sale Price 
                      {searchParams.sortBy === 'totalValue' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead>City</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('livingArea')}
                    >
                      Living Area
                      {searchParams.sortBy === 'livingArea' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead>Price/SqFt</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>{formatCurrency(property.totalValue)}</TableCell>
                      <TableCell>{property.city}</TableCell>
                      <TableCell>
                        {property.livingArea 
                          ? `${property.livingArea.toLocaleString()} sq ft`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {property.totalValue && property.livingArea
                          ? formatCurrency(property.totalValue / property.livingArea)
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{property.buildingStyle || 'N/A'}</TableCell>
                      <TableCell>{property.propertyType || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {properties.length > 0 && (
                <>
                  Showing {(((searchParams.page ?? 1) - 1) * resultsPerPage) + 1} - {Math.min((searchParams.page ?? 1) * resultsPerPage, totalCount)} of {totalCount} results
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange((searchParams.page ?? 1) - 1)}
                disabled={(searchParams.page ?? 1) === 1 || isLoading}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange((searchParams.page ?? 1) + 1)}
                disabled={(searchParams.page ?? 1) * resultsPerPage >= totalCount || isLoading}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}