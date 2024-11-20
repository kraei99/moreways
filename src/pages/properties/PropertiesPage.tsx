import { useState } from 'react';
import { usePropertySearch } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function PropertiesPage() {
  const [zipCode, setZipCode] = useState('');
  const [filters, setFilters] = useState({});
  const { data: properties, isLoading } = usePropertySearch(zipCode, filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search with current zipCode
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Properties</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]{5}"
              title="Five digit ZIP code"
            />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading properties...</div>
        ) : (
          properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </div>
  );
}