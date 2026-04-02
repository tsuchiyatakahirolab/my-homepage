"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, FormEvent } from "react";
import type { Theme, Lang } from "@/app/page";
import ObfuscatedEmail from "./ObfuscatedEmail";

interface ContactSectionProps {
  lang: Lang;
  theme: Theme;
}

export default function ContactSection({ lang, theme }: ContactSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="snap-section"
      style={{ background: "var(--surface)" }}
    >
      <div className="mx-auto flex w-full min-h-screen max-w-7xl flex-col items-center justify-center gap-10 px-6 py-16 sm:gap-16 sm:py-24 lg:flex-row lg:gap-20 lg:px-12">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm lg:max-w-md"
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Inquiries & Collaboration" : "お問い合わせ・共同研究"}
          </p>
          <h2 className="heading-serif mb-8 text-2xl lg:text-3xl">
            {lang === "en" ? "Get in Touch" : "ご連絡ください"}
          </h2>
          <div className="divider mb-8" />
          <p
            className="mb-6 text-xs leading-relaxed lg:whitespace-pre-line"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {lang === "en"
              ? <>For demos, quotes, or co-development,<br className="hidden lg:inline" /> reach out via email or form.<br className="hidden lg:inline" /> Typically replies within 48 hours.</>
              : "共同研究、講演依頼、取材等のお問い合わせは、メールまたはフォームよりご連絡ください。通常48時間以内にご返信いたします。"}
          </p>
          <p className="mb-4 text-sm" style={{ color: "var(--foreground)", opacity: 0.8 }}>
            <ObfuscatedEmail
              user="hello"
              domain="tsuchiyatakahiro.com"
              className="link-underline"
            />
          </p>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {submitted ? (
            <div className="text-center">
              <p className="heading-serif text-xl">
                {lang === "en" ? "Thank you." : "ありがとうございます。"}
              </p>
              <p
                className="mt-4 text-xs"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                {lang === "en"
                  ? "Your message has been sent."
                  : "メッセージを送信しました。"}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                  {lang === "en" ? "Name" : "お名前"}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="form-input"
                  placeholder={lang === "en" ? "Your name" : "お名前"}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                  {lang === "en" ? "Mail" : "メールアドレス"}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder={
                    lang === "en" ? "your@email.com" : "メールアドレス"
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                  {lang === "en" ? "Message" : "内容"}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="form-input resize-none"
                  placeholder={
                    lang === "en" ? "Your message..." : "お問い合わせ内容"
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full border py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
                style={{
                  borderColor: "var(--foreground)",
                  color: "var(--foreground)",
                  background: "transparent",
                }}
              >
                {lang === "en" ? "Send" : "送信"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
