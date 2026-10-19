"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Pause,
  Play,
  Trash2,
  FileDown,
  Clock,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface DownloadItem {
  id: string;
  url: string;
  title: string;
  status: "queued" | "downloading" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  speed?: number;
  eta?: number;
  thumbnailUrl?: string;
  createdAt: string;
  errorMessage?: string;
  downloadedBytes?: number;
  totalBytes?: number;
}

export default function DownloadQueue() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
    const interval = setInterval(fetchDownloads, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchDownloads = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
      const response = await axios.get(`${apiUrl}/api/downloads`);
      setDownloads(response.data);
    } catch (error) {
      console.error("Failed to fetch downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSecond?: number) => {
    if (!bytesPerSecond) return "0 B/s";
    return `${formatBytes(bytesPerSecond)}/s`;
  };

  const formatEta = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = (status: DownloadItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "failed":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-error" />;
      case "downloading":
      case "processing":
        return <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />;
      case "queued":
        return <Clock className="w-5 h-5 text-slate-400" />;
      default:
        return <Download className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <FileDown className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Downloads Yet</h3>
        <p className="text-slate-500">Start by pasting a URL above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="queue">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Download Queue</h2>
        <span className="text-sm text-slate-400">
          {downloads.filter((d) => d.status === "downloading" || d.status === "processing").length}{" "}
          active
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {downloads.map((download) => (
          <motion.div
            key={download.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="card hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {download.thumbnailUrl ? (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                  <img
                    src={download.thumbnailUrl}
                    alt={download.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FileDown className="w-8 h-8 text-slate-600" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-100 truncate">
                      {download.title || "Untitled"}
                    </h3>
                    <p className="text-sm text-slate-400 truncate">{download.url}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(download.status)}
                    <span className="text-sm text-slate-400 capitalize">
                      {download.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {(download.status === "downloading" || download.status === "processing") && (
                  <div className="mb-2">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${download.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                      <span>{download.progress.toFixed(1)}%</span>
                      {download.downloadedBytes && download.totalBytes && (
                        <span>
                          {formatBytes(download.downloadedBytes)} /{" "}
                          {formatBytes(download.totalBytes)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {download.speed && (
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {formatSpeed(download.speed)}
                    </span>
                  )}
                  {download.eta && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatEta(download.eta)}
                    </span>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(download.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Error Message */}
                {download.errorMessage && (
                  <p className="mt-2 text-sm text-error">{download.errorMessage}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
