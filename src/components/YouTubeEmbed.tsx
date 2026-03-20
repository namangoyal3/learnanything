"use client";

import { useState } from "react";
import { Play, Headphones, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  guestName?: string;
  episodeTitle?: string;
}

export default function YouTubeEmbed({
  videoId,
  startTime,
  endTime,
  guestName,
  episodeTitle,
}: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });
  if (startTime) params.set("start", String(startTime));
  if (endTime) params.set("end", String(endTime));

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}${startTime ? `&t=${startTime}` : ""}`;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-[var(--border-color)]">
        <Headphones size={16} className="text-[var(--red-primary)]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          From Lenny&apos;s Podcast
        </span>
      </div>

      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full aspect-video bg-black/50 flex flex-col items-center justify-center group cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={episodeTitle || "Podcast episode"}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[var(--red-primary)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
            <span className="text-white text-sm font-bold">Listen to the Episode</span>
            {startTime && (
              <span className="text-white/60 text-xs">
                Starting at {formatTime(startTime)}
              </span>
            )}
          </div>
        </button>
      ) : (
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={episodeTitle || "Lenny's Podcast"}
          />
        </div>
      )}

      <div className="px-4 py-3">
        {guestName && (
          <div className="text-sm font-bold">{guestName}</div>
        )}
        {episodeTitle && (
          <div className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
            {episodeTitle}
          </div>
        )}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--red-primary)] hover:underline"
        >
          Watch on YouTube <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
