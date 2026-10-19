import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Media Downloader",
  description:
    "Fast, modern media downloader powered by yt-dlp. Download videos, audio, thumbnails, subtitles and more from supported platforms.",
  keywords: [
    "media downloader",
    "video downloader",
    "audio downloader",
    "yt-dlp",
    "youtube downloader",
    "nexus",
  ],
  authors: [{ name: "Nexus Team" }],
  openGraph: {
    title: "Nexus Media Downloader",
    description: "Fast, modern media downloader powered by yt-dlp",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased">
        <div className="fixed inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
        <div className="relative z-10">{children}</div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f1f5f9",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f1f5f9",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
