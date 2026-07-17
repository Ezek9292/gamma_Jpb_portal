# GammaJobs Portal MVP

A job portal frontend for applicants and administrators, built with React, Vite, Tailwind CSS, and React Router. It integrates with the GammaJobs REST API for authentication, jobs, profiles, applications, and document uploads.

## Run locally

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend URL including `/api`. The current deployment is `https://gamma-jpb-portal-backend.onrender.com/api`.

## Configuration and security

- Copy `.env.example` to `.env` for local settings. `.env` files are ignored by Git.
- Never put passwords, AWS secret keys, database credentials, or private API keys in a Vite client variable. Any `VITE_*` value is bundled into public browser code.
- Public registration creates applicant accounts only. Administrator accounts must be provisioned by a trusted backend.
- JWTs are stored in session storage and sent as bearer tokens. Authorization, password hashing, upload validation, and administrator provisioning must always be enforced by the backend.

## Structure

- `src/app` — routing and app-wide providers
- `src/components` — shared layout, routing, and UI primitives
- `src/features` — product features grouped by domain
- `src/services` — API request and session-token handling
- `src/styles` — Tailwind entry point and signature visual styles
- `src/utils` — shared formatting helpers

The state provider coordinates API data and authenticated application state.
