# Vible

An online teaching platform built with Nuxt and Neon. **Work in progress.**

## Current features

- Google sign-in and profile setup
- Course creation, course content, and PDF, image, and ZIP attachments for teachers

## Local development

Use Node.js 24 and a Neon branch with the Vible database schema and Google sign-in enabled. Set `DATABASE_URL` and `NEON_AUTH_BASE_URL` in `src/.env.local` and allow `http://localhost:3000` in Neon Auth.

File uploads also use the `vible-files` bucket and the `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` variables in `src/.env.local`.

```bash
cd src
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).
