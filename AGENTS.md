# Codex Agent Guidelines

## Testing
- After making changes, run `npm ci` and `npm run build` from the `da-box-v2` directory.
- Ensure these commands succeed before committing.

## Notes
- The Next.js project lives in the `da-box-v2` subfolder.
- GitHub workflows expect a static build in `da-box-v2/out` and use Node.js 20.
- Copy `.env.example` to `.env` and fill in your Firebase credentials if running locally.
- Add repository secrets for each Firebase variable so CI builds use the same credentials.
- To seed Firestore with defaults, set `GOOGLE_APPLICATION_CREDENTIALS` and run `npm run setup-firestore` from `da-box-v2`. Use `INIT_ADMIN_EMAIL` and `INIT_ADMIN_PASSWORD` to create an initial admin user. Run `npm ci` first so the `firebase-admin` dependency is installed.
