# Rudransh Villa Guest Entry

A guest registration form for Rudransh Villa, Udaipur. It collects booking and
guest identity details, then sends them with ID-photo attachments by email. The
form does not store the submitted details or images.

## Setup

Create a `.env` file with the email-service credentials:

```env
RESEND_API_KEY=re_...
EMAIL_FROM="Rudransh Villa <verified-sender@example.com>"
```

`EMAIL_FROM` must be a sender verified in Resend. Submitted entries are sent to
`rudranshvillaudaipur@gmail.com`.

## Deploy to Vercel

Import the repository in Vercel. Vercel automatically detects Next.js and uses
the `npm run build` command. Add `RESEND_API_KEY` and `EMAIL_FROM` in the
project's Environment Variables settings before deploying; do not commit `.env`.

## Commands

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint
- `npm run build` — create and validate the production build
- `npm test` — build and run the rendered HTML check
