# Public Product Website

Public product website for **Web Crawl Accessibility & Compliance Monitoring** built with `Next.js 16`, TypeScript, Tailwind CSS, a ShadCN-style component layer, Recharts, NextAuth.js, and a Docker-based Strapi CMS.

## Routes and Rendering

| Route            | Purpose                 | Rendering          | Data Source                                  |
| ---------------- | ----------------------- | ------------------ | -------------------------------------------- |
| `/`              | Landing page            | ISR + CSR sections | Strapi CMS + `/api/stats` + `/api/subscribe` |
| `/features`      | Product features        | ISR                | Strapi CMS                                   |
| `/pricing`       | Pricing plans           | ISR                | Strapi CMS                                   |
| `/blog`          | Blog index              | ISR                | Strapi CMS                                   |
| `/blog/[slug]`   | Blog detail             | SSR                | Strapi CMS                                   |
| `/login`         | Auth entry              | SSR                | NextAuth + Strapi                            |
| `/signup`        | Registration            | SSR                | NextAuth + Strapi                            |
| `/dashboard`     | Protected app dashboard | SSR                | NextAuth + `/api/stats`                      |
| `/api/subscribe` | Newsletter submission   | API route          | Strapi CMS                                   |
| `/api/stats`     | aggregate stats         | API route          | Internal aggregation + Strapi subscribers    |

## CMS Integration

- `LandingPage` single type stores hero copy, testimonials, use cases, and intro content for feature/pricing pages.
- `StatsDashboard` single type stores the homepage and dashboard KPI/chart values.
- `Feature`, `PricingPlan`, and `BlogPost` collection types power reusable cards and blog routes.
- `Subscriber` collection type stores newsletter/waitlist submissions.
- Frontend fetching lives in `lib/strapi.ts`, which normalizes Strapi responses and applies ISR or no-store behavior per route.

## Blog Data Flow

1. Strapi stores blog data in the `BlogPost` collection.
2. `app/blog/page.tsx` fetches the collection with ISR.
3. `app/blog/[slug]/page.tsx` fetches an individual slug with dynamic SSR.
4. CMS content is mapped into reusable UI cards and article layout components.

## Authentication Flow

- NextAuth route handler lives at `app/api/auth/[...nextauth]/route.ts`.
- Credentials auth forwards login to Strapi `auth/local`.
- Signup posts to `app/api/auth/register/route.ts`, which creates a Strapi user and then signs in through NextAuth credentials.
- Google OAuth is enabled automatically when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present.
- Sessions use JWT strategy and cookies. The protected dashboard checks session server-side and redirects unauthenticated users to `/login`.
- Logout uses `signOut({ callbackUrl: "/" })`.

## Subscriber Handling

- The homepage waitlist form is a CSR component in `components/marketing/newsletter-form.tsx`.
- It validates the email client-side, posts to `/api/subscribe`, and surfaces success/error state.
- `/api/subscribe` validates again on the server and writes the subscriber into Strapi.
- `/api/stats` now combines Strapi-managed KPI/chart values from `StatsDashboard` with the live Strapi subscriber count and powers both the landing page chart and dashboard metrics.

## Local Setup

### 1. Frontend

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRAPI_URL`
- `STRAPI_API_TOKEN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 2. Strapi via Docker

```bash
cd strapi
cp .env.example .env
cd ..
docker compose up --build
```

After first boot:

1. Open `http://localhost:1337/admin`
2. Create the admin account
3. Enable public `find` permissions for `landing-page`, `feature`, `pricing-plan`, and `blog-post`
4. Create an API token for subscriber writes and set it as `STRAPI_API_TOKEN`
5. Seed the CMS with `LandingPage`, `StatsDashboard`, `Feature`, `PricingPlan`, and `BlogPost` entries
6. Enable public `find` permissions for `stats-dashboard` as well

## Deployment Notes

- Deploy the Next.js app to Vercel.
- Deploy the `strapi/` app to Render or another Node host with persistent storage.
- Set the same env vars in both environments.
- Update `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_URL`, and `STRAPI_URL` to production URLs.
