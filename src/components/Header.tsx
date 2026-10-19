"use client";

import { motion } from "framer-motion";
import { Download, Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-slate-700/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Nexus</h1>
              <p className="text-xs text-slate-400 hidden md:block">Media Downloader</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#queue"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Downloads
            </a>
            <a
              href="#about"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              About
            </a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 glass glass-hover rounded-lg"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-slate-700/50"
          >
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Features
              </a>
              <a
                href="#queue"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Downloads
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                About
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1 text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
