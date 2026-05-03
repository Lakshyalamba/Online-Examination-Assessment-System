# Online Examination Assessment System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLakshyalamba%2FOnline-Examination-Assessment-System&project-name=online-examination-assessment-system&repository-name=online-examination-assessment-system&root-directory=frontend&env=DATABASE_URL%2CAUTH_SECRET%2CNEXTAUTH_SECRET&envDescription=Provide%20your%20Neon%20Postgres%20connection%20string%20and%20NextAuth%20secrets.&envLink=https%3A%2F%2Fgithub.com%2FLakshyalamba%2FOnline-Examination-Assessment-System%23vercel-deploy)

## Vercel Deploy

This repository is set up for Vercel with the Next.js app in `frontend`.

Required environment variables:

- `DATABASE_URL`: Neon Postgres connection string
- `AUTH_SECRET`: random secret for authentication
- `NEXTAUTH_SECRET`: same type of secret as above; keep it set in Vercel as well

After the first deploy, initialize the database schema once:

```bash
npm install
npm run db:setup
npm run db:seed
```

You can also run the database setup directly from the backend package:

```bash
cd backend
npm run db:setup
npm run db:seed
```

The deploy button uses Vercel's `root-directory=frontend` setting and pre-fills the required env keys based on Vercel's deploy button parameters:

- Root Directory parameter: https://vercel.com/docs/deploy-button/build-settings
- Required env parameter: https://vercel.com/docs/deploy-button/environment-variables
