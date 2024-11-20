import { Property } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, DollarSign, Ruler } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onContact?: () => void;
  onViewDetails?: () => void;
}

export function PropertyCard({ property, onContact, onViewDetails }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="h-16 w-16 text-muted-foreground" />
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">
              {formatCurrency(property.financial.value)}
            </h3>
            <p className="text-muted-foreground">
              {property.address.fullAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{property.details.livingArea.toLocaleString()} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(property.details.pricePerSqFt)}/sqft</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Building Style</span>
              <span className="font-medium">{property.details.buildingStyle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Property Type</span>
              <span className="font-medium">{property.details.propertyType}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" onClick={onContact}>
              Contact Agent
            </Button>
            <Button variant="outline" className="flex-1" onClick={onViewDetails}>
              More Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}