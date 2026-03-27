export const SITE_NAME = 'Web Crawl Accessibility & Compliance Monitoring';
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const ISR_INTERVAL = 300;
export const revalidate = 300;
export const features = [
  'Continuous crawl scheduling',
  'WCAG issue scoring engine',
  'Audit-ready compliance exports',
];
export const SUBSCRIBE_FAILURE_MESSAGE =
  'Newsletter signups are temporarily unavailable. Please try again later.';
export const ALREADY_ON_WAITLIST_MESSAGE =
  'You are already on the waitlist. Subscriber already exists.';
