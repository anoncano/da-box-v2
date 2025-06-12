This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase Setup

This project relies on Firebase Authentication and Firestore. Default Firebase credentials are included in `src/firebase.js` and `.env.example`. You can override them by creating a `.env` file with your own values.

For GitHub Actions, create repository secrets matching the variable names in `.env.example` if you wish to override the defaults in CI.

### Firestore Data

User roles are stored in the `users` collection. Each user document can have `role` set to `admin`, `sub admin`, `chat admin`, or empty for a normal user. The app routes signed-in users based on this value:

- `admin` -> `/admin`
- `chat admin` -> `/chat`
- anything else -> `/general`

Global configuration like `relayHoldTime` and `inactivityTimeout` is saved in `globalSettings/settings`.

### Initializing Firestore

If your Firestore database is empty, you can create the default data by running one of the provided scripts. Both scripts require Firebase service account credentials. Set the path to your JSON key using the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

To only create `globalSettings/settings` with default configuration run:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
npm run init-firestore
```

This script creates `globalSettings/settings` with sensible defaults. It only runs once and will not overwrite an existing document.

You can also seed an initial admin user and the same settings in one go:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
export INIT_ADMIN_EMAIL=admin@example.com
export INIT_ADMIN_PASSWORD=supersecret
npm run setup-firestore
```

`setup-firestore` will create the admin authentication account and a matching document in `users/<uid>` with the role set to `admin` if they don't already exist. The global settings document is created as well if missing.
