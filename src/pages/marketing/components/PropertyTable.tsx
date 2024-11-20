import { Property, PropertySearchParams } from '@/lib/types';
import { PAGE_SIZE } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PropertyTableProps {
  data: Property[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSort: (params: Pick<PropertySearchParams, 'sortBy' | 'sortOrder'>) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Column {
  key: string;
  label: string;
  sortKey?: string;
  format?: (property: Property) => string;
}

const columns: Column[] = [
  {
    key: 'address',
    label: 'Address',
    sortKey: 'address.fullAddress',
    format: (property) => property.address.fullAddress
  },
  {
    key: 'city',
    label: 'City',
    sortKey: 'address.city',
    format: (property) => property.address.city
  },
  {
    key: 'zipCode',
    label: 'ZIP Code',
    sortKey: 'address.zipCode',
    format: (property) => property.address.zipCode
  },
  {
    key: 'value',
    label: 'Value',
    sortKey: 'financial.value',
    format: (property) => formatCurrency(property.financial.value)
  },
  {
    key: 'livingArea',
    label: 'Living Area',
    sortKey: 'details.livingArea',
    format: (property) => property.details.livingArea 
      ? `${formatNumber(property.details.livingArea)} sqft` 
      : 'N/A'
  },
  {
    key: 'propertyType',
    label: 'Type',
    sortKey: 'details.propertyType',
    format: (property) => property.details.propertyType || 'N/A'
  },
  {
    key: 'buildingStyle',
    label: 'Style',
    sortKey: 'details.buildingStyle',
    format: (property) => property.details.buildingStyle || 'N/A'
  },
  {
    key: 'yearBuilt',
    label: 'Year Built',
    sortKey: 'features.yearBuilt',
    format: (property) => property.features.yearBuilt?.toString() || 'N/A'
  }
];

export function PropertyTable({
  data,
  isLoading,
  totalCount,
  currentPage,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
}: PropertyTableProps) {
  const handleSort = (column: Column) => {
    if (column.sortKey) {
      if (column.sortKey === sortBy) {
        onSort({
          sortBy: column.sortKey,
          sortOrder: sortOrder === 'asc' ? 'desc' : 'asc'
        });
      } else {
        onSort({
          sortBy: column.sortKey,
          sortOrder: 'asc'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortKey === sortBy && (
                    <span className="text-gray-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((property, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.format ? column.format(property) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="py-4 px-6 bg-white border-t border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex}</span> to{' '}
              <span className="font-medium">{endIndex}</span>{' '}
              of <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={endIndex >= totalCount}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
