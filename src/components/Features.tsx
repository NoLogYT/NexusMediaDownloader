"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Layers,
  Globe,
  Settings,
  Download,
  FileVideo,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by yt-dlp for maximum download speeds and reliability",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "1000+ Platforms",
    description: "Download from YouTube, Vimeo, SoundCloud, and countless other sites",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileVideo,
    title: "Multiple Formats",
    description: "Video, audio, thumbnails, subtitles, chapters, and metadata",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Layers,
    title: "Batch Downloads",
    description: "Queue multiple downloads and process playlists automatically",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Settings,
    title: "Full Control",
    description: "Choose quality, format, and customize every aspect of your downloads",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your downloads are processed securely with no data retention",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Download,
    title: "Progress Tracking",
    description: "Real-time updates with speed, ETA, and download status",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Modern Interface",
    description: "Beautiful, responsive design that works on all devices",
    color: "from-fuchsia-500 to-purple-500",
  },
];

export default function Features() {
  return (
    <div id="features" className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Everything You Need
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Professional-grade media downloading with all the features you expect
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-100">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
      >
        {[
          { label: "Supported Sites", value: "1000+" },
          { label: "Video Formats", value: "50+" },
          { label: "Audio Codecs", value: "20+" },
          { label: "Uptime", value: "99.9%" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card text-center"
          >
            <div className="text-4xl font-bold text-gradient mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
