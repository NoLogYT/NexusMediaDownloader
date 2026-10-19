"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LinkIcon,
  Download,
  Settings2,
  Loader2,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  FileText,
  Info,
  Play,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type DownloadType = "video" | "audio" | "thumbnail" | "subtitle" | "metadata";
type QualityPreference = "best" | "1080p" | "720p" | "480p" | "audio_only";

interface DownloadOptions {
  downloadType: DownloadType;
  quality: QualityPreference;
  downloadThumbnail: boolean;
  downloadSubtitles: boolean;
  embedMetadata: boolean;
}

interface DownloadFormProps {
  onDownloadAdded?: () => void;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  uploadDate: string;
  viewCount: number;
  formats: any[];
}

export default function DownloadForm({ onDownloadAdded }: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [options, setOptions] = useState<DownloadOptions>({
    downloadType: "video",
    quality: "best",
    downloadThumbnail: false,
    downloadSubtitles: false,
    embedMetadata: true,
  });

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsAnalyzing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/analyze`, {
        url: url.trim(),
      });

      setVideoInfo(response.data);
      setShowPreview(true);
      toast.success("Video analyzed successfully!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      const message =
        error.response?.data?.detail || "Failed to analyze URL. Please check the URL and try again.";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsAnalyzing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/download`, {
        url: url.trim(),
        options,
      });

      toast.success("Download started successfully!");
      setUrl("");
      setVideoInfo(null);
      setShowPreview(false);
      onDownloadAdded?.();
    } catch (error: any) {
      console.error("Download error:", error);
      const message =
        error.response?.data?.detail || "Failed to start download. Please check the URL and try again.";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadTypeIcons = {
    video: FileVideo,
    audio: FileAudio,
    thumbnail: ImageIcon,
    subtitle: FileText,
    metadata: Info,
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-slate-300">
            Media URL
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video, audio, or playlist URL..."
                className="input-field pl-12"
                disabled={isAnalyzing}
              />
            </div>
            <button
              type="button"
              onClick={analyzeUrl}
              disabled={isAnalyzing || !url.trim()}
              className="btn-secondary px-4 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Preview
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Supports YouTube, Vimeo, SoundCloud, and 1000+ other platforms
          </p>
        </div>

        {/* Video Preview */}
        {showPreview && videoInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="relative">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {videoInfo.duration > 0 && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/90 rounded text-xs font-medium">
                  {formatDuration(videoInfo.duration)}
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-100">{videoInfo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                {videoInfo.uploader && <span>{videoInfo.uploader}</span>}
                {videoInfo.viewCount && (
                  <span>{formatNumber(videoInfo.viewCount)} views</span>
                )}
                {videoInfo.uploadDate && <span>{videoInfo.uploadDate}</span>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Download Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Download Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(["video", "audio", "thumbnail", "subtitle", "metadata"] as DownloadType[]).map(
              (type) => {
                const Icon = downloadTypeIcons[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOptions({ ...options, downloadType: type })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      options.downloadType === type
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-slate-700 hover:border-slate-600 text-slate-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium capitalize">{type}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Quality Selection (for video/audio) */}
        {(options.downloadType === "video" || options.downloadType === "audio") && (
          <div className="space-y-2">
            <label htmlFor="quality" className="block text-sm font-medium text-slate-300">
              Quality
            </label>
            <select
              id="quality"
              value={options.quality}
              onChange={(e) =>
                setOptions({ ...options, quality: e.target.value as QualityPreference })
              }
              className="input-field"
            >
              <option value="best">Best Available</option>
              {options.downloadType === "video" && (
                <>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </>
              )}
              <option value="audio_only">Audio Only</option>
            </select>
          </div>
        )}

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 glass rounded-xl"
          >
            <div className="flex items-center justify-between">
              <label htmlFor="thumbnail" className="text-sm text-slate-300">
                Download Thumbnail
              </label>
              <input
                id="thumbnail"
                type="checkbox"
                checked={options.downloadThumbnail}
                onChange={(e) =>
                  setOptions({ ...options, downloadThumbnail: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="subtitles" className="text-sm text-slate-300">
                Download Subtitles
              </label>
              <input
                id="subtitles"
                type="checkbox"
                checked={options.downloadSubtitles}
                onChange={(e) =>
                  setOptions({ ...options, downloadSubtitles: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="metadata" className="text-sm text-slate-300">
                Embed Metadata
              </label>
              <input
                id="metadata"
                type="checkbox"
                checked={options.embedMetadata}
                onChange={(e) =>
                  setOptions({ ...options, embedMetadata: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              />
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isAnalyzing}
          className="btn-primary w-full flex items-center justify-center gap-3"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Start Download
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
