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

export default function DownloadForm({ onDownloadAdded }: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<DownloadOptions>({
    downloadType: "video",
    quality: "best",
    downloadThumbnail: false,
    downloadSubtitles: false,
    embedMetadata: true,
  });

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

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-slate-300">
            Media URL
          </label>
          <div className="relative">
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
          <p className="text-xs text-slate-500">
            Supports YouTube, Vimeo, SoundCloud, and 1000+ other platforms
          </p>
        </div>

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
              Analyzing...
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
