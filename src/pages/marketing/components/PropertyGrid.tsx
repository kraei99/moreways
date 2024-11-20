import { Property } from '@/lib/types';
import { PropertyCard } from './PropertyCard';
import { Loader2, Home } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
}

export function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-12">
        <Home className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No properties found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard
          key={index}
          property={property}
          onContact={() => {}}
          onViewDetails={() => {}}
        />
      ))}
    </div>
  );
}