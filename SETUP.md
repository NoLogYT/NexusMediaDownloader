# Nexus Media Downloader - Setup Guide

This guide will help you get Nexus Media Downloader up and running on your local machine or deploy it to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **Python** 3.11 or later ([Download](https://www.python.org/))
- **FFmpeg** ([Download](https://ffmpeg.org/download.html))
- **Git** ([Download](https://git-scm.com/))

### Optional (for advanced features)

- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **PostgreSQL** 16+ (for persistent storage)
- **Redis** 7+ (for job queue management)

---

## Local Development

### 1. Install FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

Verify installation:
```bash
ffmpeg -version
```

### 2. Clone the Repository

```bash
git clone <repository-url>
cd "Nexus Website"
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd api
pip install -r requirements.txt
cd ..
```

Or using a virtual environment (recommended):

```bash
cd api
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=your-secret-key-change-this
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=104857600
```

### 6. Start Development Servers

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run api:dev
```

Or manually:
```bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Open in Browser

Visit [http://localhost:3000](http://localhost:3000)

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Docker Deployment

### Quick Start with Docker Compose

1. **Ensure Docker is installed and running**

```bash
docker --version
docker-compose --version
```

2. **Build and start all services**

```bash
docker-compose up -d
```

3. **View logs**

```bash
docker-compose logs -f
```

4. **Access the application**

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

5. **Stop services**

```bash
docker-compose down
```

### Build Individual Images

**Frontend:**
```bash
docker build -t nexus-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 nexus-frontend
```

**Backend:**
```bash
docker build -t nexus-api -f Dockerfile.api .
docker run -p 8000:8000 -v $(pwd)/downloads:/app/downloads nexus-api
```

---

## Production Deployment

### 1. Security Configuration

**Update CORS settings in `api/main.py`:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Generate secure API key:**

```bash
# Generate a random secret key
openssl rand -hex 32
```

Update `.env`:
```env
API_SECRET_KEY=<generated-key>
```

### 2. Environment Variables

Create a production `.env` file:

```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
API_SECRET_KEY=<your-secure-key>

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/nexus_db

# Redis
REDIS_URL=redis://redis-host:6379

# Storage
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=104857600

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 3. Build for Production

**Frontend:**
```bash
npm run build
npm run start
```

**Backend:**
```bash
cd api
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 4. Reverse Proxy Setup (nginx)

Create `/etc/nginx/sites-available/nexus`:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL/TLS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### 6. Process Management (PM2)

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'nexus-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/Nexus Website',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'nexus-api',
      script: 'uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      cwd: '/path/to/Nexus Website/api',
      interpreter: 'python3',
    },
  ],
};
```

Start services:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Automated File Cleanup

Create a cleanup script `api/cleanup.py`:

```python
import os
import time
from pathlib import Path

DOWNLOAD_DIR = Path("./downloads")
MAX_AGE_HOURS = 24

def cleanup_old_files():
    now = time.time()
    for file_path in DOWNLOAD_DIR.glob("*"):
        if file_path.is_file():
            age_hours = (now - file_path.stat().st_mtime) / 3600
            if age_hours > MAX_AGE_HOURS:
                file_path.unlink()
                print(f"Deleted: {file_path}")

if __name__ == "__main__":
    cleanup_old_files()
```

Add to crontab:
```bash
crontab -e
# Add this line to run every hour
0 * * * * cd /path/to/Nexus\ Website/api && python3 cleanup.py
```

---

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Build errors:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Backend Issues

**yt-dlp not found:**
```bash
pip install --upgrade yt-dlp
```

**FFmpeg not found:**
Ensure FFmpeg is in your PATH:
```bash
ffmpeg -version
```

**Permission errors:**
```bash
# Ensure downloads directory is writable
chmod 755 downloads
```

### Docker Issues

**Port conflicts:**
```bash
docker-compose down
# Change ports in docker-compose.yml
docker-compose up -d
```

**Build cache issues:**
```bash
docker-compose build --no-cache
docker-compose up -d
```

**View container logs:**
```bash
docker-compose logs api
docker-compose logs frontend
```

### Common Errors

**CORS errors:**
- Check `allow_origins` in `api/main.py`
- Ensure `NEXT_PUBLIC_API_URL` matches your API URL

**Download failures:**
- Check yt-dlp version: `yt-dlp --version`
- Update yt-dlp: `pip install --upgrade yt-dlp`
- Check FFmpeg: `ffmpeg -version`

**Slow downloads:**
- Check your internet connection
- Some sites may rate-limit downloads
- Try a different quality setting

---

## Need Help?

- Check the [main README](README.md)
- Open an issue on GitHub
- Review yt-dlp documentation: https://github.com/yt-dlp/yt-dlp

---

**Built with ❤️ using Next.js and yt-dlp**
