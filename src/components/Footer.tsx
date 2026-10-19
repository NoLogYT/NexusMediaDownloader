"use client";

import { motion } from "framer-motion";
import { Github, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 mt-24" id="about">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">Nexus</h3>
            <p className="text-slate-400 mb-4 max-w-md">
              A modern, fast media downloader powered by yt-dlp. Download videos,
              audio, and more from 1000+ platforms with ease.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/yt-dlp/yt-dlp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  yt-dlp
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ffmpeg.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  FFmpeg
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Responsible Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Nexus Media Downloader. Released under MIT License.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-500" /> using Next.js and
              yt-dlp
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 glass rounded-xl">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Disclaimer:</strong> This tool is for
            downloading content you have the right to download. Respect copyright laws
            and the terms of service of content platforms. Only download content you own
            or have permission to download. This service does not support DRM
            circumvention or bypassing access controls.
          </p>
        </div>
      </div>
    </footer>
  );
}
