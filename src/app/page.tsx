"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProfileSection from "@/components/ProfileSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ResearchSection from "@/components/ResearchSection";
import LectureSection from "@/components/LectureSection";
import AccessSection from "@/components/AccessSection";
import ContactSection from "@/components/ContactSection";
import VideoSection from "@/components/VideoSection";
import FooterSection from "@/components/FooterSection";
import MediaProtection from "@/components/MediaProtection";
import ScrollIndicator from "@/components/ScrollIndicator";

export type Theme = "white" | "black";
export type Lang = "en" | "jp";
export type TimeOfDay = "day" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  // 05:00-00:59 = day, 01:00-04:59 = night
  if (hour >= 1 && hour <= 4) return "night";
  return "day";
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("white");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");

  const toggleLang = () => setLang((prev) => (prev === "en" ? "jp" : "en"));
  const toggleTheme = () =>
    setTheme((prev) => (prev === "white" ? "black" : "white"));

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isDark = theme === "black";
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    root.style.setProperty("--background", isDark ? "#0a0a0a" : "#ffffff");
    root.style.setProperty("--foreground", isDark ? "#f0f0f0" : "#1a1a1a");
    root.style.setProperty("--accent", isDark ? "#777777" : "#888888");
    root.style.setProperty("--border", isDark ? "#2a2a2a" : "#e0e0e0");
    root.style.setProperty("--surface", isDark ? "#111111" : "#fafafa");
    root.style.setProperty(
      "--overlay",
      isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)"
    );
  }, [theme]);

  return (
    <>
      <MediaProtection />
      <ScrollIndicator />
      <Header
        lang={lang}
        theme={theme}
        onToggleLang={toggleLang}
        onToggleTheme={toggleTheme}
      />
      <main className="snap-container">
        <HeroSection lang={lang} theme={theme} timeOfDay={timeOfDay} />
        <ProfileSection lang={lang} theme={theme} />
        <ExpertiseSection lang={lang} theme={theme} />
        <ResearchSection lang={lang} theme={theme} />
        <LectureSection lang={lang} theme={theme} />
        <VideoSection theme={theme} timeOfDay={timeOfDay} />
        <AccessSection lang={lang} theme={theme} />
        <ContactSection lang={lang} theme={theme} />
        <FooterSection lang={lang} theme={theme} />
      </main>
    </>
  );
}
