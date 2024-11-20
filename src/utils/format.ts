/**
 * Format a ZIP code number to a 5-digit string with leading zeros
 * @param zip ZIP code as a number
 * @returns Formatted 5-digit ZIP code string
 */
export function formatZipCode(zip: number): string {
  return zip.toString().padStart(5, '0');
}

/**
 * Convert a ZIP code string to number format for database queries
 * Always removes the leading zero for database compatibility
 * Example: "02114" -> 2114
 * @param zip ZIP code as a string
 * @returns ZIP code as a number
 */
export function normalizeZipCode(zip: string): number {
  // Remove leading zeros and convert to number
  const normalized = parseInt(zip.replace(/^0+/, ''), 10);
  return normalized;
}

/**
 * Validate if a string is a valid 5-digit ZIP code
 * @param zip ZIP code as a string
 * @returns boolean indicating if the ZIP code is valid
 */
export function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}
