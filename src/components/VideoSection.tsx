"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Theme, TimeOfDay } from "@/app/page";

interface VideoSectionProps {
  theme: Theme;
  timeOfDay: TimeOfDay;
}

function getVideoSrc(theme: Theme, timeOfDay: TimeOfDay): string {
  return `/video/shiz_hero_${timeOfDay}_${theme === "black" ? "dark" : "white"}.mp4`;
}

export default function VideoSection({ theme, timeOfDay }: VideoSectionProps) {
  const videoSrc = getVideoSrc(theme, timeOfDay);
  const isDark = theme === "black";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const handleClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      if (ended) {
        video.currentTime = 0;
        setEnded(false);
      }
      // Unmute on play
      video.muted = false;
      video.play();
      setPlaying(true);
    }
  }, [playing, ended]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setEnded(true);
  }, []);

  return (
    <section
      className="snap-section relative flex items-center justify-center overflow-hidden"
      style={{ background: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <motion.div
        className="relative mx-6 my-12 w-full max-w-6xl cursor-pointer overflow-hidden lg:mx-12"
        style={{ aspectRatio: "16/9" }}
        animate={{ opacity: ended ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          key={videoSrc}
          muted
          playsInline
          onEnded={handleEnded}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Play button overlay */}
        {!playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border sm:h-20 sm:w-20"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.3)",
                background: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
              >
                <polygon points="0,0 20,12 0,24" />
              </svg>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
