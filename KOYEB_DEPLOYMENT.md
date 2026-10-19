# Deploying to Koyeb

Quick guide for deploying Nexus Media Downloader to Koyeb.

## Architecture

Since Koyeb is similar to Railway but with some differences, we'll use:
- **Koyeb**: Both frontend and backend
- **Two separate services**: One for frontend, one for backend

## Prerequisites

- GitHub account with your code pushed
- Koyeb account (free tier available)

## Deployment Steps

### Step 1: Generate package-lock.json

Before pushing to GitHub, generate the lockfile:

```bash
npm install --package-lock-only
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Step 2: Deploy Backend to Koyeb

1. Go to https://app.koyeb.com
2. Click "Create Service"
3. Choose "GitHub" as source
4. Select your repository
5. Configure:
   - **Name**: `nexus-api`
   - **Build method**: Dockerfile
   - **Dockerfile path**: `Dockerfile.api`
   - **Port**: 8000
6. Click "Deploy"
7. Wait for deployment and copy the URL

### Step 3: Deploy Frontend to Koyeb

1. Click "Create Service" again
2. Choose "GitHub" as source
3. Select your repository
4. Configure:
   - **Name**: `nexus-frontend`
   - **Build method**: Dockerfile
   - **Dockerfile path**: `Dockerfile`
   - **Port**: 3000
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = Your backend URL from Step 2
6. Click "Deploy"

### Step 4: Update CORS

Edit `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexus-frontend-your-org.koyeb.app",  # Your Koyeb frontend URL
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
git commit -m "Update CORS for Koyeb"
git push
```

Koyeb will auto-redeploy!

## Alternative: Simpler Dockerfiles

If you continue to have issues, here are simplified Dockerfiles:

### Simplified Frontend Dockerfile

Create `Dockerfile.koyeb`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

### Simplified Backend Dockerfile

Your current `Dockerfile.api` should work fine.

## Troubleshooting

### "npm ci requires package-lock.json"

Run locally:
```bash
npm install --package-lock-only
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Port binding issues

Koyeb expects apps to bind to `0.0.0.0:$PORT`. Both Dockerfiles already do this.

### CORS errors

Make sure:
1. Your frontend URL is in the CORS `allow_origins`
2. You're using the full URL (https://...)
3. No trailing slashes

### Build timeout

Koyeb free tier has build time limits. The current Dockerfiles are optimized but if needed:
- Remove unused dependencies
- Use `.dockerignore`

## Koyeb-specific Configuration

Create `koyeb.yaml` in the root (optional):

```yaml
services:
  - name: nexus-api
    type: web
    build:
      dockerfile: Dockerfile.api
    ports:
      - port: 8000
        protocol: http
    env:
      - key: PORT
        value: "8000"
    
  - name: nexus-frontend
    type: web
    build:
      dockerfile: Dockerfile
    ports:
      - port: 3000
        protocol: http
    env:
      - key: NEXT_PUBLIC_API_URL
        value: https://nexus-api-your-org.koyeb.app
      - key: PORT
        value: "3000"
```

## Cost

**Koyeb Free Tier:**
- 2 web services (perfect for frontend + backend)
- 512MB RAM per service
- Automatic HTTPS
- Free custom domain

**Paid Tier:**
- Starts at $5.40/month per service
- More resources and features

## Testing

1. Visit your frontend URL
2. Test the health check: `https://nexus-api-your-org.koyeb.app/`
3. Try downloading a video

## Next Steps

- Add custom domain
- Set up monitoring
- Configure autoscaling (paid tier)
- Add PostgreSQL database

---

**You're live on Koyeb! 🚀**
