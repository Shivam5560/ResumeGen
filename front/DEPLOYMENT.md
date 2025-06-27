# Deployment Guide

## Vercel Deployment

1. **Environment Variables**
   Set these in your Vercel dashboard under Settings > Environment Variables:
   ```
   BACKEND_URL=https://resumegen-780f.onrender.com
   NEXT_PUBLIC_BACKEND_URL=https://resumegen-780f.onrender.com
   ```

2. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: (leave empty, uses default)
   - Install Command: `npm install`

3. **Function Configuration**
   The `vercel.json` file configures function timeouts for API routes.

## Testing Deployment

1. **Health Check**
   Visit: `https://your-app.vercel.app/api/health`
   Should return backend connectivity status.

2. **Resume Generation**
   Test the main functionality through the web interface.

## Troubleshooting

- Check Vercel function logs for errors
- Verify environment variables are set correctly
- Ensure backend URL is accessible
- Test API endpoints individually
