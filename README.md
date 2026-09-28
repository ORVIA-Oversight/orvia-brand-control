# ORVIA Brand Control

Fresh standalone internal platform for ORVIA brand, social, media, voice, website and publishing control.

## Why this repository exists

This project deliberately does **not** inherit ORVIA Command routing, PWA, authentication redirects or deployment rules. Command remains a separate product. IRIS communicates with Brand Control through a controlled API contract.

## Core principles

- IRIS remains the sole conductor.
- Brand Control is the source of operational brand constraints and approved presentation rules.
- Real data only: no invented social metrics, connection states, claims, testimonials or awards.
- Material public release remains human approval-gated.
- Voice, websites, social, media and prompts use the same current brand context.
- VERA verifies implementation after approved release.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Production

Recommended new GitHub repository: `ORVIA-Oversight/orvia-brand-control`

Recommended Vercel project: `orvia-brand-control`

Production branch: `main`

Domain: `brand-control.orvia.org.uk`

Do not attach this project to `command.orvia.org.uk`.

## Environment variables

Populate server-side only. Do not place API secrets in `NEXT_PUBLIC_*` variables.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IRIS_INTAKE_SECRET`
- `HEYGEN_API_KEY`
- `SYNTHESIA_API_KEY`
- `VAPI_API_KEY`
- optional native-link URLs for PromptEditor, Sintra and Holo

## APIs

- `GET /api/health`
- `GET /api/brand/manifest`
- `POST /api/brand/validate`
- `POST /api/iris/intake`

`POST /api/iris/intake` accepts `instruction`, optional `buzz`/`signal` context, `priority`, `approval_required`, and `source_reference`. With Supabase configured it writes work to `admin_work_queue` assigned to `BRAND-01`.
