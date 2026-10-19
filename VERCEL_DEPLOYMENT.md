# Deploying Nexus Media Downloader to Vercel

This guide covers deploying the Nexus Media Downloader to Vercel.

## ⚠️ Important Limitations

**Vercel has significant limitations for this project:**

1. **Serverless Functions Timeout**: Vercel has a 10-second timeout for Hobby plans and 60-second for Pro plans. Media downloads often take much longer.
2. **No Persistent Storage**: Vercel's filesystem is read-only except for `/tmp`, which is cleared between invocations.
3. **No Long-Running Processes**: Background tasks are limited by function timeout.
4. **FFmpeg/yt-dlp Size**: Binary dependencies may exceed Vercel's 50MB limit.

### Recommended Architecture for Vercel

```
Vercel (Frontend) → External API (Backend)
     ↓                        ↓
  Next.js              Railway/Render/Fly.io
                       (FastAPI + yt-dlp)
```

## Option 1: Frontend Only on Vercel (Recommended)

Deploy the Next.js frontend on Vercel and host the Python backend elsewhere.

### Step 1: Prepare Frontend

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### Step 2: Deploy to Vercel

**Via Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Via GitHub Integration:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

### Step 4: Deploy Backend to Railway

**Railway.app** is recommended for the Python backend:

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub (select your repo)
4. Add a Nixpacks build:
   - Railway will auto-detect Python
   - Ensure `api/` directory has `main.py` and `requirements.txt`
5. Set PORT environment variable to `8000`
6. Get your Railway URL and update Vercel's `NEXT_PUBLIC_API_URL`

## Option 2: Monorepo on Vercel (Limited)

If you want to try hosting both on Vercel (with limitations):

### Step 1: Convert Backend to Vercel Serverless Functions

Create `api/vercel.json`:

```json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.11",
      "maxDuration": 60
    }
  }
}
```

### Step 2: Modify Backend for Serverless

The backend needs significant changes:
- Remove long-running downloads
- Use webhook callbacks instead
- Store files in S3/R2 instead of filesystem
- Implement job queue with external service

This requires substantial refactoring.

## Option 3: Vercel + External Storage + Queue

Full production setup with Vercel frontend:

```
Vercel Frontend
     ↓
Vercel API Routes → Queue (Upstash Redis)
     ↓
Worker Service (Railway/Render)
     ↓
Storage (S3/R2/Cloudflare)
```

## Recommended: Split Architecture

### Frontend on Vercel

```bash
# In project root
vercel --prod
```

### Backend on Railway

1. Create `Procfile` in `api/`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Create `railway.json` in `api/`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

3. Deploy to Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

4. Set environment variables in Railway dashboard

## Alternative Backend Hosting Options

### 1. Render.com (Free Tier Available)

**Pros:**
- Free tier with 750 hours/month
- Supports Docker
- Persistent disk storage
- No cold starts on paid plans

**Deploy:**
```bash
# Create render.yaml
services:
  - type: web
    name: nexus-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    healthCheckPath: /
```

### 2. Fly.io

**Pros:**
- Generous free tier
- Persistent volumes
- Edge deployment
- Docker support

**Deploy:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Create app
fly launch

# Deploy
fly deploy
```

### 3. DigitalOcean App Platform

**Pros:**
- Simple deployment
- Managed infrastructure
- Built-in monitoring

**Cost:** ~$5/month for basic

### 4. Railway (Recommended)

**Pros:**
- Easy GitHub integration
- Free $5 credit monthly
- Simple environment management
- Great DX

**Deploy:** Connect GitHub repo, auto-deploys on push

## Step-by-Step: Vercel + Railway Deployment

### 1. Deploy Backend to Railway

```bash
cd api

# Create railway.json
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
  }
}
EOF

# Deploy
railway login
railway init
railway up

# Get your URL
railway domain
```

### 2. Update CORS in Backend

Edit `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",
        "http://localhost:3000"  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Deploy Frontend to Vercel

```bash
# In project root
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL

# When prompted, enter your Railway URL:
https://your-backend.railway.app

# Deploy to production
vercel --prod
```

### 4. Test the Deployment

Visit your Vercel URL: `https://your-app.vercel.app`

## Post-Deployment Configuration

### Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown

**Railway:**
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS CNAME

### Environment Variables

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL production
```

**Railway:**
```bash
railway variables set API_SECRET_KEY=your-secret-key
```

## Monitoring & Logs

**Vercel:**
- Dashboard → Deployments → View Function Logs
- Real-time logs: `vercel logs`

**Railway:**
- Dashboard → Deployments → View Logs
- CLI: `railway logs`

## Cost Estimation

### Free Tier
- Vercel: Free (Hobby)
- Railway: $5 credit/month
- Total: Essentially free for low traffic

### Production
- Vercel Pro: $20/month
- Railway: ~$5-20/month (usage-based)
- Total: ~$25-40/month

## Troubleshooting

### Backend not responding
```bash
# Check Railway logs
railway logs

# Check health endpoint
curl https://your-backend.railway.app/
```

### CORS errors
Ensure your Vercel domain is in the CORS `allow_origins` list in `api/main.py`

### Timeout errors
Railway has generous timeouts, but check your function execution time

### FFmpeg errors
Ensure FFmpeg is installed in Railway environment (automatically included with apt)

## Alternative: Fully Serverless with AWS

For a fully serverless approach:
- Frontend: Vercel
- API: AWS API Gateway + Lambda
- Processing: AWS Step Functions + Lambda
- Storage: S3
- Queue: SQS

This requires significant refactoring but scales automatically.

## Conclusion

**Best Approach:**
1. ✅ Frontend on Vercel (fast, free, CDN)
2. ✅ Backend on Railway (simple, affordable, persistent)
3. ✅ Files stored temporarily on Railway
4. ✅ Consider S3/R2 for production file storage

This gives you:
- Fast global frontend delivery
- Reliable backend with long timeouts
- Simple deployment and management
- Cost-effective for low-medium traffic

---

**Ready to deploy? Start with Railway for the backend, then Vercel for the frontend!**
