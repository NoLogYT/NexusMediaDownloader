# 🚀 Quick Deployment Guide

Get Nexus Media Downloader live in under 10 minutes!

## Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Nexus Media Downloader"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nexus-downloader.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway (3 minutes)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Python and deploys!
6. Click "Generate Domain" to get your API URL
7. Copy the URL (e.g., `https://nexus-api-production.up.railway.app`)

**Environment Variables (Optional):**
- Click "Variables" tab
- Add: `PORT=8000`

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   
5. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your Railway URL from Step 2
   
6. Click "Deploy"

## Step 4: Update CORS (2 minutes)

1. Get your Vercel URL (e.g., `https://nexus-downloader.vercel.app`)

2. Edit `api/main.py`:
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

3. Commit and push:
```bash
git add api/main.py
git commit -m "Update CORS for production"
git push
```

Railway will auto-deploy the update!

## ✅ Done!

Visit your Vercel URL and start downloading! 🎉

## Test Your Deployment

1. Open your Vercel URL
2. Paste a YouTube URL
3. Click "Start Download"
4. Watch it work! 🎬

## Monitoring

**Vercel Logs:**
```bash
vercel logs
```

**Railway Logs:**
- Go to Railway dashboard
- Click on your project
- Click "Deployments" → "View Logs"

## Troubleshooting

### "Failed to start download"
- Check Railway logs for errors
- Verify CORS settings in `api/main.py`
- Check environment variable in Vercel

### CORS errors
- Ensure your Vercel domain is in `allow_origins`
- Check browser console for exact error

### Backend not responding
```bash
# Test the API directly
curl https://your-api.railway.app/

# Should return:
# {"name":"Nexus Media Downloader API","version":"1.0.0","status":"online"}
```

## Custom Domain (Optional)

**Vercel:**
1. Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

**Railway:**
1. Settings → Networking
2. Add custom domain
3. Add CNAME record

## Costs

Both platforms offer generous free tiers:

- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Railway**: $5 free credit/month (enough for hobby projects)

## Next Steps

- Add authentication
- Set up database (PostgreSQL on Railway)
- Add Redis for job queue
- Configure custom domain
- Set up monitoring

---

**You're live! Share your link and start downloading!** 🚀
