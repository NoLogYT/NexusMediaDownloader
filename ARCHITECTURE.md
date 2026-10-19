# Project Architecture

## Overview

Nexus Media Downloader is a modern full-stack web application built with a clean separation between frontend and backend services. The architecture follows current best practices for scalability, maintainability, and user experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Browser (Desktop/Mobile)                             │  │
│  │  - React 19 Components                                │  │
│  │  - Framer Motion Animations                           │  │
│  │  - Real-time WebSocket Updates                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (App Router)                              │  │
│  │  - Server Components for SEO                          │  │
│  │  - Client Components for Interactivity                │  │
│  │  - API Routes for Backend Communication               │  │
│  │  - Static Asset Optimization                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                       Backend Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI Server                                        │  │
│  │  - RESTful API Endpoints                              │  │
│  │  - Request Validation (Pydantic)                      │  │
│  │  - Background Task Processing                         │  │
│  │  - WebSocket Support (Future)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                     Processing Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  yt-dlp Engine                                        │  │
│  │  - URL Analysis                                        │  │
│  │  - Media Extraction                                    │  │
│  │  - Format Selection                                    │  │
│  │  - Progress Reporting                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FFmpeg                                               │  │
│  │  - Format Conversion                                   │  │
│  │  - Metadata Embedding                                  │  │
│  │  - Audio/Video Muxing                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                       Storage Layer                          │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  File System   │  │  Database    │  │  Cache (Redis) │  │
│  │  - Downloads   │  │  - History   │  │  - Jobs        │  │
│  │  - Temp Files  │  │  - Users     │  │  - Sessions    │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Components**: Radix UI (Accessible)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Validation**: Pydantic
- **Media Processing**: yt-dlp
- **Video/Audio**: FFmpeg
- **ASGI Server**: Uvicorn

### Infrastructure (Production)
- **Containerization**: Docker, Docker Compose
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Reverse Proxy**: nginx
- **SSL/TLS**: Let's Encrypt
- **Process Manager**: PM2
- **Monitoring**: (To be added)

## Component Architecture

### Frontend Components

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page composition
│   └── globals.css         # Global styles and utilities
└── components/
    ├── Header.tsx          # Navigation and branding
    ├── Footer.tsx          # Links and legal info
    ├── DownloadForm.tsx    # URL input and options
    ├── DownloadQueue.tsx   # Active downloads display
    └── Features.tsx        # Marketing/feature showcase
```

**Component Principles:**
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Build complex UIs from simple components
- **Props over Context**: Pass data explicitly for clarity
- **Accessibility First**: ARIA labels, keyboard navigation, screen reader support

### Backend API Structure

```
api/
├── main.py              # FastAPI app, routes, and business logic
└── requirements.txt     # Python dependencies
```

**API Endpoints:**
- `GET /` - Health check
- `POST /api/download` - Create download job
- `GET /api/downloads` - List all downloads
- `GET /api/downloads/{id}` - Get specific download
- `DELETE /api/downloads/{id}` - Delete download
- `POST /api/analyze` - Analyze URL without downloading

## Data Flow

### Download Request Flow

```
1. User Input
   └─> URL entered in DownloadForm
       └─> Options selected (type, quality, extras)

2. Client Validation
   └─> URL format checked
       └─> Required fields validated

3. API Request
   └─> POST /api/download
       └─> Request body: { url, options }

4. Server Processing
   └─> Generate unique download ID
       └─> Initialize download record
           └─> Queue background task

5. Background Task
   └─> Extract video info with yt-dlp
       └─> Update download metadata
           └─> Start download with progress hooks
               └─> Process with FFmpeg (if needed)

6. Progress Updates
   └─> Hook called on download events
       └─> Update in-memory state
           └─> Client polls GET /api/downloads

7. Completion
   └─> File saved to disk
       └─> Status updated to "completed"
           └─> Client displays success
```

## State Management

### Frontend State

**Local Component State**
- Form inputs
- UI toggles
- Temporary data

**Server State** (via polling/WebSocket)
- Download queue
- Progress updates
- Status changes

### Backend State

**In-Memory** (Current)
- Active downloads dictionary
- Progress tracking
- Temporary metadata

**Persistent** (Future)
- User accounts (PostgreSQL)
- Download history (PostgreSQL)
- Job queue (Redis)

## Security Architecture

### Input Validation
```python
# Pydantic models validate all inputs
class DownloadRequest(BaseModel):
    url: str  # Validated as string
    options: DownloadOptions  # Nested validation

# yt-dlp arguments passed safely
ydl_opts = {
    'outtmpl': output_template,  # Sanitized path
    'format': 'bestvideo+bestaudio'  # No shell injection
}
```

### CORS Configuration
```python
# Production: Restrict to specific origins
allow_origins=["https://yourdomain.com"]
```

### File System Safety
- Output paths sanitized
- Files scoped to download directory
- No path traversal vulnerabilities

## Scalability Considerations

### Current Limitations
- In-memory storage (lost on restart)
- Single-server deployment
- No horizontal scaling
- Polling for updates (not real-time)

### Future Enhancements

**Horizontal Scaling**
```
Load Balancer
     │
     ├─> Frontend Instance 1
     ├─> Frontend Instance 2
     └─> Frontend Instance N
              ↓
     API Load Balancer
     │
     ├─> API Instance 1
     ├─> API Instance 2
     └─> API Instance N
              ↓
        Redis (Queue)
              ↓
     Worker Pool
     ├─> Worker 1
     ├─> Worker 2
     └─> Worker N
```

**Features for Scale**
- Redis job queue (BullMQ)
- WebSocket for real-time updates
- CDN for static assets
- Database connection pooling
- Caching layer
- Rate limiting per user
- Background worker pool

## Performance Optimization

### Frontend
- Server-side rendering for initial load
- Code splitting with Next.js
- Image optimization
- Font optimization
- Bundle size analysis

### Backend
- Async/await throughout
- Background task processing
- Connection pooling
- Response caching
- Efficient progress hooks

## Monitoring & Observability

### Logging
- Frontend: Browser console, external service (e.g., Sentry)
- Backend: Structured logging to stdout/files

### Metrics (Future)
- Download success rate
- Average download time
- Error rates by type
- User activity metrics
- System resource usage

### Health Checks
- `GET /` - API health
- Frontend build validation
- Dependency version checks

## Deployment Architecture

### Development
```
Local Machine
├─> Frontend (localhost:3000)
└─> Backend (localhost:8000)
```

### Production (Recommended)
```
Internet
    ↓
nginx (HTTPS)
    ├─> Frontend (3000) → Next.js
    └─> API (8000) → FastAPI
            ↓
    ┌───────┴───────┐
PostgreSQL      Redis
```

## Design Patterns

### Frontend
- **Component Composition**: Build UIs from small, reusable pieces
- **Hooks**: useState, useEffect for lifecycle management
- **Custom Hooks**: Reusable stateful logic
- **HOC Pattern**: Framer Motion for animations

### Backend
- **Dependency Injection**: FastAPI's DI system
- **Repository Pattern**: (Future) Abstract data access
- **Background Tasks**: Async job processing
- **Factory Pattern**: yt-dlp options builder

## Future Architecture Plans

1. **Authentication Layer**: JWT-based auth with refresh tokens
2. **API Gateway**: Rate limiting, request transformation
3. **Microservices**: Separate download workers
4. **Message Queue**: RabbitMQ or Redis Streams
5. **Kubernetes**: Container orchestration
6. **CI/CD Pipeline**: Automated testing and deployment
7. **Monitoring Stack**: Prometheus + Grafana
8. **Distributed Tracing**: OpenTelemetry

---

**Last Updated**: 2026-10-19
