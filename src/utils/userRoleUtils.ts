// User role detection utilities
// Uses role field from database for role-based routing

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  role?: string;
}

/**
 * Determines if a user is a manager based on role field only
 * @param user - User object from API response
 * @returns boolean - true if user is a manager
 */
export function isManager(user: User | null): boolean {
  if (!user) return false;

  // Only check role field from database
  return user.role === 'Manager';
}

/**
 * Gets user role based on available data
 * @param user - User object from API response
 * @returns string - 'Manager' or 'Employee'
 */
export function getUserRole(user: User | null): string {
  return isManager(user) ? 'Manager' : 'Employee';
}
