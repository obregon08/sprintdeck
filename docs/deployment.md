# Deployment

## Deploy to Vercel

The easiest way to deploy is using the Vercel integration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase)

This will:
- Clone the repository to your GitHub
- Set up the Supabase integration
- Automatically configure environment variables
- Deploy to Vercel

## Manual Deployment

### 1. Build the application

```bash
npm run build
```

### 2. Deploy to your preferred platform

Choose from these popular platforms:

#### Vercel
- Connect your GitHub repository
- Set environment variables in the dashboard
- Automatic deployments on push

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