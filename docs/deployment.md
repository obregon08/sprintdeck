# Deployment

This document covers deployment to various platforms. For detailed Vercel-specific configuration and troubleshooting, see [Vercel Deployment Guide](./vercel-deployment.md).

## Deploy to Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Configure required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically use the build configuration from `package.json` and `vercel.json`

For detailed Vercel setup including Prisma configuration, see the [Vercel Deployment Guide](./vercel-deployment.md).

## Manual Deployment

### 1. Build the application

```bash
npm run build
```

### 2. Deploy to your preferred platform

Choose from these popular platforms:

#### Vercel
See the [Vercel Deployment Guide](./vercel-deployment.md) for detailed setup instructions including Prisma configuration.

#### Netlify
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `.next`
- Configure environment variables

#### Railway
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Configure environment variables

#### DigitalOcean App Platform
- Connect your GitHub repository
- Set build command: `npm run build`
- Set run command: `npm start`
- Configure environment variables

### 3. Set environment variables

Make sure to set these environment variables in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Environment Configuration

### Production Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `DATABASE_URL` | Your Supabase PostgreSQL connection string | Yes |
| `DIRECT_URL` | Your Supabase direct PostgreSQL connection string | Yes |
| `VERCEL_URL` | Vercel deployment URL (auto-set) | No |

### Supabase Configuration

1. **Row Level Security (RLS)**: Enable RLS policies for production
2. **API Keys**: Use production API keys, not development keys
3. **Database**: Ensure your database is properly configured
4. **Auth Settings**: Configure allowed redirect URLs for your domain

## Post-Deployment Checklist

- [ ] Verify authentication flow works
- [ ] Test protected routes
- [ ] Check environment variables are set correctly
- [ ] Verify Supabase connection
- [ ] Test email confirmation flow
- [ ] Monitor error logs
- [ ] Set up monitoring (optional)

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Check your deployment platform's environment variable settings
   - Ensure variable names match exactly

2. **Supabase Connection Issues**
   - Verify your Supabase project URL and API keys
   - Check if your Supabase project is active

3. **Build Failures**
   - Check build logs for TypeScript errors
   - Ensure all dependencies are properly installed

4. **Authentication Not Working**
   - Verify redirect URLs in Supabase Auth settings
   - Check if your domain is allowed in Supabase 