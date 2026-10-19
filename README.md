# Nexus Media Downloader - Web Application

A modern, fast web-based media downloader powered by **yt-dlp**. Download videos, audio, thumbnails, subtitles, and metadata from 1000+ platforms with a beautiful, responsive interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)

## ✨ Features

- **🚀 Lightning Fast** - Powered by yt-dlp for maximum performance
- **🌐 1000+ Platforms** - YouTube, Vimeo, SoundCloud, and more
- **🎬 Multiple Formats** - Video, audio, thumbnails, subtitles, chapters, metadata
- **📦 Batch Downloads** - Queue multiple downloads and process playlists
- **⚙️ Full Control** - Choose quality, format, and customize every aspect
- **🔒 Secure & Private** - No data retention, secure processing
- **📊 Real-time Progress** - Live updates with speed, ETA, and status
- **🎨 Modern UI** - Beautiful, responsive design with dark theme
- **♿ Accessible** - WCAG 2.1 AA compliant

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Zustand

**Backend:**
- FastAPI
- yt-dlp
- Python 3.11+

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL (optional)
- Redis (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- FFmpeg (for media processing)

### Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Nexus Website"
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd api
pip install -r requirements.txt
cd ..
```

4. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start the development servers**

In one terminal (Frontend):
```bash
npm run dev
```

In another terminal (Backend):
```bash
npm run api:dev
# or
cd api && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Individual Docker Images

**Frontend:**
```bash
docker build -t nexus-frontend .
docker run -p 3000:3000 nexus-frontend
```

**Backend:**
```bash
docker build -t nexus-api -f Dockerfile.api .
docker run -p 8000:8000 nexus-api
```

## 📁 Project Structure

```
Nexus Website/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   └── components/            # React components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── DownloadForm.tsx
│       ├── DownloadQueue.tsx
│       └── Features.tsx
├── api/                       # FastAPI backend
│   ├── main.py               # API server
│   └── requirements.txt      # Python dependencies
├── public/                    # Static assets
├── docker-compose.yml        # Docker orchestration
├── Dockerfile                # Frontend container
├── Dockerfile.api            # Backend container
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Node.js dependencies
```

## 🎯 API Endpoints

### Health Check
```http
GET /
```

### Create Download
```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "options": {
    "downloadType": "video",
    "quality": "best",
    "downloadThumbnail": true,
    "downloadSubtitles": false,
    "embedMetadata": true
  }
}
```

### Get All Downloads
```http
GET /api/downloads
```

### Get Download by ID
```http
GET /api/downloads/{download_id}
```

### Analyze URL
```http
POST /api/analyze
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Delete Download
```http
DELETE /api/downloads/{download_id}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=your-secret-key-here

# Database (Optional)
DATABASE_URL=postgresql://nexus:password@localhost:5432/nexus_db

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=104857600

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 🔒 Security Considerations

- **Input Validation**: All URLs and user inputs are validated
- **No Shell Injection**: Arguments passed safely to yt-dlp
- **CORS Configuration**: Configure allowed origins in production
- **Rate Limiting**: Implement rate limiting for production use
- **File Cleanup**: Implement automatic cleanup of old downloads
- **Authentication**: Add authentication for production deployment

## 🚧 Production Deployment

### Recommended Steps:

1. **Set up a reverse proxy** (nginx, Caddy)
2. **Configure HTTPS** with Let's Encrypt
3. **Add authentication** (JWT, OAuth)
4. **Implement rate limiting**
5. **Set up monitoring** (Sentry, LogRocket)
6. **Configure CDN** for static assets
7. **Use PostgreSQL** for persistent storage
8. **Use Redis** for job queue management
9. **Implement file cleanup** cron jobs
10. **Set proper CORS** origins

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**This tool is for downloading content you have the right to download.** Respect copyright laws and the terms of service of content platforms. Only download content you own or have permission to download.

This service does not support DRM circumvention or bypassing access controls.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - The core download engine
- [FFmpeg](https://ffmpeg.org) - Media processing
- [Next.js](https://nextjs.org) - React framework
- [FastAPI](https://fastapi.tiangolo.com) - Python web framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://www.radix-ui.com) - Accessible components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and yt-dlp
