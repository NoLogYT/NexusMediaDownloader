from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
import yt_dlp
import uuid
import os
import asyncio
from datetime import datetime
from pathlib import Path
import json

app = FastAPI(
    title="Nexus Media Downloader API",
    description="Backend API for Nexus Media Downloader powered by yt-dlp",
    version="1.0.0",
)

# CORS middleware - UPDATE THIS WITH YOUR VERCEL URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Replace with your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage
DOWNLOAD_DIR = Path("./downloads")
DOWNLOAD_DIR.mkdir(exist_ok=True)

# In-memory download tracking (use Redis in production)
downloads_db: Dict[str, Dict[str, Any]] = {}


class DownloadOptions(BaseModel):
    downloadType: str = "video"
    quality: str = "best"
    downloadThumbnail: bool = False
    downloadSubtitles: bool = False
    embedMetadata: bool = True


class DownloadRequest(BaseModel):
    url: str
    options: DownloadOptions


class AnalyzeRequest(BaseModel):
    url: str


class DownloadResponse(BaseModel):
    id: str
    url: str
    status: str
    message: str


class ProgressHook:
    """Custom progress hook for yt-dlp"""

    def __init__(self, download_id: str):
        self.download_id = download_id

    def __call__(self, d: dict):
        if d["status"] == "downloading":
            downloads_db[self.download_id].update(
                {
                    "status": "downloading",
                    "progress": self._calculate_progress(d),
                    "speed": d.get("speed", 0),
                    "eta": d.get("eta", 0),
                    "downloadedBytes": d.get("downloaded_bytes", 0),
                    "totalBytes": d.get("total_bytes") or d.get("total_bytes_estimate", 0),
                }
            )
        elif d["status"] == "finished":
            downloads_db[self.download_id].update(
                {
                    "status": "processing",
                    "progress": 100,
                }
            )

    def _calculate_progress(self, d: dict) -> float:
        total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
        downloaded = d.get("downloaded_bytes", 0)
        if total > 0:
            return (downloaded / total) * 100
        return 0


def get_ydl_opts(download_id: str, options: DownloadOptions) -> dict:
    """Build yt-dlp options based on user preferences"""

    output_template = str(DOWNLOAD_DIR / f"{download_id}_%(title)s.%(ext)s")

    ydl_opts = {
        "outtmpl": output_template,
        "progress_hooks": [ProgressHook(download_id)],
        "quiet": False,
        "no_warnings": False,
        "extract_flat": False,
    }

    # Download type specific options
    if options.downloadType == "audio":
        ydl_opts.update(
            {
                "format": "bestaudio/best",
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
            }
        )
    elif options.downloadType == "video":
        # Quality selection
        if options.quality == "best":
            ydl_opts["format"] = "bestvideo+bestaudio/best"
        elif options.quality == "1080p":
            ydl_opts["format"] = "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
        elif options.quality == "720p":
            ydl_opts["format"] = "bestvideo[height<=720]+bestaudio/best[height<=720]"
        elif options.quality == "480p":
            ydl_opts["format"] = "bestvideo[height<=480]+bestaudio/best[height<=480]"

        ydl_opts["merge_output_format"] = "mp4"

    elif options.downloadType == "thumbnail":
        ydl_opts["skip_download"] = True
        ydl_opts["writethumbnail"] = True
    elif options.downloadType == "subtitle":
        ydl_opts["skip_download"] = True
        ydl_opts["writesubtitles"] = True
        ydl_opts["allsubtitles"] = True
    elif options.downloadType == "metadata":
        ydl_opts["skip_download"] = True
        ydl_opts["writeinfojson"] = True

    # Additional options
    if options.downloadThumbnail and options.downloadType == "video":
        ydl_opts["writethumbnail"] = True

    if options.downloadSubtitles and options.downloadType == "video":
        ydl_opts["writesubtitles"] = True
        ydl_opts["writeautomaticsub"] = True

    if options.embedMetadata:
        ydl_opts["postprocessors"] = ydl_opts.get("postprocessors", [])
        ydl_opts["postprocessors"].append({"key": "FFmpegMetadata"})

    return ydl_opts


async def download_media(download_id: str, url: str, options: DownloadOptions):
    """Background task to download media"""
    try:
        ydl_opts = get_ydl_opts(download_id, options)

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first
            info = ydl.extract_info(url, download=False)

            # Update download info
            downloads_db[download_id].update(
                {
                    "title": info.get("title", "Unknown"),
                    "thumbnailUrl": info.get("thumbnail"),
                    "status": "downloading",
                }
            )

            # Perform download
            ydl.download([url])

        # Mark as completed
        downloads_db[download_id].update(
            {
                "status": "completed",
                "progress": 100,
                "completedAt": datetime.utcnow().isoformat(),
            }
        )

    except Exception as e:
        downloads_db[download_id].update(
            {
                "status": "failed",
                "errorMessage": str(e),
                "completedAt": datetime.utcnow().isoformat(),
            }
        )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "name": "Nexus Media Downloader API",
        "version": "1.0.0",
        "status": "online",
        "yt_dlp_version": yt_dlp.version.__version__,
    }


@app.post("/api/analyze")
async def analyze_url(request: AnalyzeRequest):
    """Analyze a URL and return video information for preview"""
    url = request.url

    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return {
            "title": info.get("title"),
            "description": info.get("description"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration", 0),
            "uploader": info.get("uploader"),
            "uploadDate": info.get("upload_date"),
            "viewCount": info.get("view_count"),
            "isPlaylist": info.get("_type") == "playlist",
            "formats": [
                {
                    "formatId": f.get("format_id"),
                    "ext": f.get("ext"),
                    "quality": f.get("format_note"),
                    "filesize": f.get("filesize"),
                    "resolution": f.get("resolution"),
                }
                for f in info.get("formats", [])[:10]  # Limit to first 10 formats
            ],
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to analyze URL: {str(e)}")


@app.post("/api/download", response_model=DownloadResponse)
async def create_download(
    request: DownloadRequest, background_tasks: BackgroundTasks
):
    """Create a new download task"""

    # Validate URL
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL is required")

    # Generate unique download ID
    download_id = str(uuid.uuid4())

    # Initialize download record
    downloads_db[download_id] = {
        "id": download_id,
        "url": request.url,
        "title": "Analyzing...",
        "status": "queued",
        "progress": 0,
        "createdAt": datetime.utcnow().isoformat(),
        "options": request.options.dict(),
    }

    # Start download in background
    background_tasks.add_task(download_media, download_id, request.url, request.options)

    return DownloadResponse(
        id=download_id,
        url=request.url,
        status="queued",
        message="Download queued successfully",
    )


@app.get("/api/downloads")
async def get_downloads():
    """Get all downloads"""
    # Return downloads sorted by creation time (newest first)
    sorted_downloads = sorted(
        downloads_db.values(),
        key=lambda x: x.get("createdAt", ""),
        reverse=True,
    )
    return sorted_downloads


@app.get("/api/downloads/{download_id}")
async def get_download(download_id: str):
    """Get a specific download by ID"""
    if download_id not in downloads_db:
        raise HTTPException(status_code=404, detail="Download not found")
    return downloads_db[download_id]


@app.delete("/api/downloads/{download_id}")
async def delete_download(download_id: str):
    """Delete a download record"""
    if download_id not in downloads_db:
        raise HTTPException(status_code=404, detail="Download not found")

    # Remove from database
    del downloads_db[download_id]

    # TODO: Clean up files

    return {"message": "Download deleted successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
