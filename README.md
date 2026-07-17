# Departure Job Portal MVP

A frontend-first job portal for applicants and administrators, built with React, Vite, Tailwind CSS, and React Router.

## Run locally

```bash
npm install
npm run dev
```

## Demo accounts

- Applicant: `applicant@departure.dev` / `demo123`
- Admin: `admin@departure.dev` / `demo123`

All data is intentionally in memory for the MVP. Refreshing the browser resets new accounts, profiles, applications, and jobs.

## Structure

- `src/app` — routing and app-wide providers
- `src/components` — shared layout, routing, and UI primitives
- `src/features` — product features grouped by domain
- `src/data` — API-shaped mock data
- `src/styles` — Tailwind entry point and signature visual styles
- `src/utils` — shared formatting helpers

The state provider is the seam for later backend integration: replace its mock operations with API calls while keeping the feature components stable.
