export const pageRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
} as const;

export const apiRoutes = {
  auth: {
    register: '/api/auth/register',
  },
  stats: '/api/stats',
  subscribe: '/api/subscribe',
  mockCrawl: '/api/mock-crawl',
} as const;
