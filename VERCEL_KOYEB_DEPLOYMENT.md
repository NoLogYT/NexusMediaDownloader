# Vercel + Koyeb Deployment Guide

## Architecture

- **Vercel**: Frontend only (Next.js)
- **Koyeb**: Backend only (FastAPI + yt-dlp)

This is the optimal setup because:
- ✅ Vercel is perfect for Next.js (native support, fast CDN)
- ✅ Koyeb handles long-running processes (downloads)
- ✅ Both have generous free tiers

## Quick Deployment (5 minutes)

### Step 1: Deploy Backend to Koyeb (2 minutes)

1. Go to https://app.koyeb.com
2. Click **"Create Service"**
3. Choose **GitHub** → Select your repository
4. Configure:
   - **Name**: `nexus-api`
   - **Build method**: Dockerfile
   - **Dockerfile**: `Dockerfile.api`
   - **Port**: `8000`
5. Click **Deploy**
6. **Copy the URL** (e.g., `https://nexus-api-yourorg.koyeb.app`)

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js ✅
5. **Add Environment Variable**:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your Koyeb backend URL
6. Click **Deploy**

### Step 3: Update CORS (30 seconds)

Get your Vercel URL (e.g., `https://nexus-downloader.vercel.app`)

Edit `api/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexus-downloader.vercel.app",  # Your Vercel URL
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```bash
git add api/main.py
git commit -m "Update CORS for production"
git push
```

Koyeb auto-redeploys!

## ✅ Done!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.koyeb.app`

## Why This Works Better

**Vercel for Frontend:**
- ✅ Native Next.js support (no Docker needed)
- ✅ Automatic builds and deployments
- ✅ Global CDN
- ✅ Instant rollbacks

**Koyeb for Backend:**
- ✅ Supports long-running downloads
- ✅ Full FFmpeg + yt-dlp support
- ✅ No timeout limits
- ✅ Persistent filesystem

## Costs

- **Vercel**: FREE (Hobby tier)
- **Koyeb**: FREE ($5 monthly credit)
- **Total**: $0/month 🎉

## Troubleshooting

### CORS Errors
Make sure your Vercel domain is in the CORS list in `api/main.py`

### Backend Not Responding
Check Koyeb logs in the dashboard

### Environment Variable Not Working
Re-add the env var in Vercel settings and redeploy

---

**You're live! 🚀**
