# Vercel Deployment Guide

## Prisma Client Generation Issue

This project has been configured to fix the common Prisma Client initialization error on Vercel.

## Changes Made

### 1. Updated Build Script
The `package.json` build script now includes Prisma generation:
```json
"build": "prisma generate && next build"
```

### 2. Added Postinstall Script
Added a postinstall script to ensure Prisma Client is generated after npm install:
```json
"postinstall": "prisma generate"
```

### 3. Updated Next.js Configuration
Added `serverExternalPackages` to properly handle Prisma Client:
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
};
```

### 4. Created Vercel Configuration
Added `vercel.json` with proper build settings:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  }
}
```

## Environment Variables Required

Make sure to set these environment variables in your Vercel dashboard:

- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add the required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically use the updated build configuration

## Verification

After deployment, verify that:
- The build completes successfully without Prisma errors
- Your application connects to the database properly
- Authentication flows work correctly

## Troubleshooting

If you still encounter Prisma errors:

1. **Check Environment Variables**: Ensure `DATABASE_URL` is set correctly
2. **Clear Build Cache**: In Vercel dashboard, go to project settings and clear build cache
3. **Redeploy**: Trigger a new deployment after clearing cache

## Local Testing

Test the build locally before deploying:
```bash
npm run build
```

This should complete without errors and generate the Prisma Client successfully. 