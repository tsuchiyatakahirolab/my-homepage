# Favicon Assets — tsuchiyatakahiro.com

## 運用方針

- **ブラウザ favicon は白背景版**で統一（`#FFFFFF` / 角丸なし / 縁なし / 影なし）
- **透過背景版はこのディレクトリに保存**（比較・再利用のため）

## ファイル構成

### 本番で参照される白背景版

| ファイル | 用途 | サイズ |
|---|---|---|
| `src/app/icon.png` | Next.js 自動配信ブラウザ favicon | 32×32 |
| `src/app/apple-icon.png` | iOS ホーム画面アイコン | 180×180 |
| `public/favicon.ico` | レガシー互換用 ICO（16/32/48 内包） | マルチ |
| `public/favicon-16x16.png` | タブアイコン小 | 16×16 |
| `public/favicon-32x32.png` | タブアイコン大 | 32×32 |
| `public/android-chrome-192x192.png` | Android PWA | 192×192 |
| `public/android-chrome-512x512.png` | Android PWA / 高解像度 | 512×512 |
| `public/maskable-icon-192x192.png` | OS丸型マスク用（safe area 80%） | 192×192 |
| `public/maskable-icon-512x512.png` | OS丸型マスク用（safe area 80%） | 512×512 |
| `public/images/icon-192.png` | 既存参照互換 | 192×192 |
| `public/images/icon-512.png` | 既存参照互換 | 512×512 |

### 保存用資産（このディレクトリ）

| ファイル | 用途 |
|---|---|
| `icon-transparent-64x64.png` | 旧ブラウザ favicon（透過）— 保存用 |
| `apple-icon-transparent-180x180.png` | 旧 apple-icon（透過）— 保存用 |

## 参照経路

- HTML `<head>` 内の `<link rel="icon">` 等は Next.js metadata API が自動生成
  （[src/app/layout.tsx](../../src/app/layout.tsx) の `icons` フィールド）
- PWA manifest は [src/app/manifest.ts](../../src/app/manifest.ts) が `/manifest.webmanifest` を動的配信

## 設計判断メモ

- **16×16 / 32×32**：白背景 + 濃色マーク。マーク相対サイズは透過版と同一（拡大補正なし）
- **apple-touch-icon**：180×180 白背景。iOS 側で角丸は自動適用される
- **maskable**：マークを 80% に縮小し中央配置。OS が丸型・角丸にマスクしても崩れない safe area を確保
- 元素材は `public/images/icon-512.png`（512×512、最高解像度）を使用し、各サイズは LANCZOS でダウンスケール
