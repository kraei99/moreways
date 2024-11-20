import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Property } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const {
    address,
    details,
    financial,
    features
  } = property;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{address.fullAddress}</h3>
            <p className="text-sm text-gray-500">
              {address.city}, {address.zipCode}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {formatCurrency(financial.value)}
            </p>
            {details.livingArea && (
              <p className="text-sm text-gray-500">
                {formatCurrency(details.pricePerSqFt)}/sqft
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Living Area</p>
            <p className="text-sm text-gray-500">
              {details.livingArea ? `${formatNumber(details.livingArea)} sqft` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Property Type</p>
            <p className="text-sm text-gray-500">
              {details.propertyType || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Style</p>
            <p className="text-sm text-gray-500">
              {details.buildingStyle || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Year Built</p>
            <p className="text-sm text-gray-500">
              {features.yearBuilt || 'N/A'}
            </p>
          </div>
          {features.yearRemodeled && (
            <div>
              <p className="text-sm font-medium">Year Remodeled</p>
              <p className="text-sm text-gray-500">
                {features.yearRemodeled}
              </p>
            </div>
          )}
          {financial.taxAmount && (
            <div>
              <p className="text-sm font-medium">Annual Tax</p>
              <p className="text-sm text-gray-500">
                {formatCurrency(financial.taxAmount)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}