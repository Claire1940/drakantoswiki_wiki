"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [isAutoPlayable, setIsAutoPlayable] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);

  useEffect(() => {
    const target = frameRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsAutoPlayable(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = isAutoPlayable || manualPlay;

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const embedUrl = useMemo(
    () => {
      const base = `https://www.youtube.com/embed/${videoId}?mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
      return shouldPlay ? `${base}&autoplay=1` : base;
    },
    [videoId, shouldPlay],
  );

  return (
    <div className="space-y-4">
      <div
        ref={frameRef}
        className="relative w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        {!shouldPlay && (
          <button
            onClick={() => setManualPlay(true)}
            className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition hover:bg-[hsl(var(--nav-theme)/0.9)]"
            aria-label="Play trailer"
          >
            <Play className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
