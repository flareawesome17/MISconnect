# MISconnect

MISconnect is a modular Next.js and Firebase workspace for ticketing, RBAC, notifications, reports, settings, and password management.

## Workspace Layout

- `apps/web`: Next.js App Router frontend and API route boundary
- `apps/api`: server-side domain services, repositories, RBAC, and Firebase Admin integration
- `packages/shared`: shared types, DTOs, permission constants, and Zod schemas

## Getting Started

```sh
npm install
npm run dev
```

The root scripts target the Next.js workspace:

- `npm run dev`
- `npm run build`
- `npm run start:web`
- `npm run typecheck`
- `npm run lint`

## Environment

Copy `apps/web/.env.example` into your local environment and provide the Firebase client and Firebase Admin values required by the web and API layers.

## Firebase

This repository still uses Firebase Auth, Firestore, and Storage rules. The Firebase config in the repo now covers rules and indexes only; hosting for the Next.js app should be configured separately based on the final deployment target.
