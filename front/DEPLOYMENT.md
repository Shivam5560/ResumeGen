# Deployment Guide

## Vercel Deployment Steps

### 1. Environment Variables in Vercel Dashboard
Set these in your Vercel dashboard under Settings > Environment Variables:

**Production Variables:**
```
BACKEND_URL=https://resumegen-780f.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://resumegen-780f.onrender.com
NODE_ENV=production
```

### 2. Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: (leave empty, uses default `.next`)
- Install Command: `npm install`
- Node.js Version: 18.x or 20.x

### 3. Deploy from GitHub
1. Connect your GitHub repository to Vercel
2. Select the `front` folder as the root directory
3. Add environment variables
4. Deploy

## Testing After Deployment

### 1. Test Basic API Connectivity
```bash
# Test if APIs are accessible
curl https://your-app.vercel.app/api/test
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/generate-resume
```

### 2. Expected Responses
- `/api/test` should return `{"message": "API is working!"}`
- `/api/health` should return backend connectivity status
- `/api/generate-resume` GET should return API info

### 3. Browser Testing
1. Visit: `https://your-app.vercel.app`
2. Check browser console for errors
3. Test the health endpoint: `https://your-app.vercel.app/api/health`

## Common Issues & Solutions

### 404 Errors on API Routes
1. Verify `vercel.json` is in the root of your project
2. Check that API files are in `src/app/api/` directory
3. Ensure each route has proper exports (GET, POST, etc.)

### Environment Variable Issues
1. Set variables in Vercel dashboard, not just `.env.local`
2. Use `NEXT_PUBLIC_` prefix for client-side variables
3. Redeploy after changing environment variables

### Backend Connection Issues
1. Verify backend URL is accessible: `curl https://resumegen-780f.onrender.com/health`
2. Check CORS settings on backend
3. Test with Postman first

## Debugging Commands

```bash
# Check if backend is accessible
curl -v https://resumegen-780f.onrender.com/health

# Test your deployed API
curl -v https://your-app.vercel.app/api/health

# Test resume generation
curl -X POST https://your-app.vercel.app/api/generate-resume \
  -H "Content-Type: application/json" \
  -d '{"data":{"personal":{"name":"Test"}}}'
```

## Vercel Function Logs
Access logs via:
1. Vercel Dashboard > Functions tab
2. CLI: `vercel logs`
3. Real-time: `vercel logs --follow`
