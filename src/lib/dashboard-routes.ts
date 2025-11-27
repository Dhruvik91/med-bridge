/**
 * Get the dashboard route for a given user role
 */
export function getDashboardRoute(role: string | null): string {
  switch (role) {
    case 'candidate':
    case 'doctor':
      return '/dashboard/candidate';
    case 'employer':
    case 'hospital':
      return '/dashboard/employer';
    case 'admin':
      return '/dashboard/candidate'; // Default to candidate for now
    default:
      return '/dashboard/candidate';
  }
}
