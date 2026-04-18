import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "オフライン | 土屋貴裕",
  description: "現在オフラインです。",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <p
        className="mb-4 text-[10px] font-medium tracking-[0.3em] uppercase"
        style={{ opacity: 0.4 }}
      >
        Offline
      </p>
      <h1 className="heading-serif mb-6 text-3xl lg:text-4xl">
        現在オフラインです
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed" style={{ opacity: 0.7 }}>
        ネットワーク接続を確認してください。一度訪れたページは
        オフラインでも閲覧できます。
      </p>
      <Link
        href="/"
        className="link-underline text-xs font-medium tracking-[0.2em] uppercase"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
