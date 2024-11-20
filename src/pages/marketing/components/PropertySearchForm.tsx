import React, { useState } from 'react';
import { isValidZipCode } from '@/utils/format';

interface PropertySearchFormProps {
  onSearch: (zipCode: string) => void;
}

export function PropertySearchForm({ onSearch }: PropertySearchFormProps) {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ZIP code
    if (!zipCode) {
      setError('ZIP code is required');
      return;
    }
    
    if (!isValidZipCode(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code (e.g., 02114)');
      return;
    }

    setError('');
    onSearch(zipCode);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 5 characters
    if (/^\d{0,5}$/.test(value)) {
      setZipCode(value);
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="zipCode"
            id="zipCode"
            value={zipCode}
            onChange={handleZipCodeChange}
            className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-md border ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } focus:outline-none focus:ring-1 sm:text-sm`}
            placeholder="Enter ZIP code (e.g., 02114)"
            maxLength={5}
            pattern="\d{5}"
            inputMode="numeric"
          />
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  );
}