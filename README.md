# Rudransh Villa, Udaipur

The marketing website and private guest-registration form for Rudransh Villa.
The public website includes enquiry handling, search landing pages for villa and
homestay stays in Udaipur, sitemap support, and a private `/guest-entry` route.

## Setup

Create a `.env` file with the email-service credentials:

```env
RESEND_API_KEY=re_...
EMAIL_FROM="Rudransh Villa <verified-sender@example.com>"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

`EMAIL_FROM` must be a sender verified in Resend. `NEXT_PUBLIC_SITE_URL` must
be your final Vercel/custom domain so the generated sitemap and robots file use
the correct public URLs. Submitted entries and enquiries are sent to
`rudranshvillaudaipur@gmail.com`.

## Deploy to Vercel

Import the repository in Vercel. Vercel automatically detects Next.js and uses
the `npm run build` command. Add `RESEND_API_KEY`, `EMAIL_FROM`, and
`NEXT_PUBLIC_SITE_URL` in the project's Environment Variables settings before
deploying; do not commit `.env`.

## Commands

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint
- `npm run build` — create and validate the production build
- `npm test` — run ESLint
