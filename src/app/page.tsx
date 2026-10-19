"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import DownloadForm from "@/components/DownloadForm";
import DownloadQueue from "@/components/DownloadQueue";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDownloadAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Download Media
              <br />
              <span className="text-gradient">Effortlessly</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed">
              Powered by yt-dlp, supporting 1000+ platforms. Fast, reliable, and
              feature-rich.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DownloadForm onDownloadAdded={handleDownloadAdded} />
          </motion.div>
        </section>

        {/* Download Queue Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <DownloadQueue key={refreshKey} />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <Features />
        </section>
      </main>

      <Footer />
    </div>
  );
}
