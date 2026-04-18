# PWA Module

両サイト共通の PWA アーキテクチャ記録。Tier 1（基盤）完了 → Tier 2/3 拡張時の参照用。

## ディレクトリ構成

```
src/pwa/
  PwaProvider.tsx    ← SW 登録 + ライフサイクル管理（root layout に1回mount）
  ShareButton.tsx    ← Web Share API + clipboard fallback（任意のページに配置）
  README.md          ← このファイル

public/
  sw.js              ← Service Worker 本体（モジュール拡張可能設計）
  manifest.webmanifest ← src/app/manifest.ts が動的生成
  screenshots/       ← manifest screenshots フィールド用画像

src/app/
  manifest.ts        ← Next.js MetadataRoute.Manifest として定義
  offline/page.tsx   ← オフライン時 SW フォールバック
```

## Tier 1（実装済み）

| 機能 | 実装 | エントリポイント |
|---|---|---|
| Service Worker | `public/sw.js` | install / activate / fetch |
| HTML キャッシュ戦略 | network-first | navigations |
| 静的アセットキャッシュ | cache-first | `/_next/static/*` |
| 画像/フォントキャッシュ | stale-while-revalidate | image, font, style, script |
| オフラインフォールバック | `/offline` ページ | navigation 失敗時 |
| SW ライフサイクル管理 | `PwaProvider` | layout.tsx |
| Native Share | `ShareButton` | 任意配置 |
| Manifest screenshots | `manifest.ts` の `screenshots[]` | Chrome インストール UI |
| PWA カテゴリ・言語 | `manifest.ts` | `categories`, `lang`, `dir` |

## Tier 2 拡張ポイント（未実装、コメントアウト済み）

### A. プッシュ通知
1. **VAPID 鍵生成**: `npx web-push generate-vapid-keys`
2. **環境変数設定**: `.env.local` に `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
3. **`sw.js`**: `self.addEventListener("push", ...)` のコメントアウト解除
4. **`PwaProvider`**: `pushManager.subscribe()` ロジック追加 → サブスクリプション情報をサーバーに送信
5. **API ルート追加**: `/api/push/subscribe`, `/api/push/send` (`web-push` パッケージ使用)
6. **管理画面**: 配信スケジューラ（または Notion → webhook → push）

### B. Background Sync（フォーム再送）
1. **IndexedDB キュー**: `idb` パッケージで `contact-form-queue` テーブル
2. **`sw.js`**: `self.addEventListener("sync", ...)` のコメントアウト解除
3. **ContactForm**: 送信失敗時に IndexedDB に保存し `registration.sync.register("contact-form-queue")`
4. **SW 内**: 同期イベント発火時にキューを drain → `/api/contact` に POST

### C. Badging API（未読数バッジ）
1. **`PwaProvider`**: 未読数を IndexedDB に保存
2. **News fetch 時**: 新着があれば `navigator.setAppBadge(unreadCount)`
3. **既読時**: `navigator.clearAppBadge()`

### D. Periodic Background Sync（定期取得）
1. **`sw.js`**: `self.addEventListener("periodicsync", ...)` 追加
2. **`PwaProvider`**: `registration.periodicSync.register("news-poll", { minInterval: 24*60*60*1000 })`
3. 24時間ごとに News API を fetch → 新着あれば push 通知

## Tier 3 拡張ポイント

### E. Web Share Target（共有先として登録）
- `manifest.ts` に `share_target` フィールド追加
- 専用ルート `/share` で受信したコンテンツを処理
- 例: 他アプリからの記事 URL を受信して "Save for later" に追加

### F. File Handler（ファイル関連付け）
- `manifest.ts` に `file_handlers` フィールド追加
- PDF・docx 等を OS から直接開ける

### G. Window Controls Overlay（カスタムタイトルバー）
- `manifest.ts` で `display_override: ["window-controls-overlay"]`
- ヘッダーをタイトルバー内に組み込んでネイティブ感を強化

## Cache 更新運用

`public/sw.js` の先頭 `CACHE_VERSION = "v1"` を **デプロイのたびに必ずバンプ**するか、
`PRECACHE_URLS` を変更したときにバンプ。

`activate` イベントで古いキャッシュは自動削除されます。

## 開発時の注意

- **`PwaProvider` は production のみ動作**: `process.env.NODE_ENV === "production"` でガード
- **dev で SW を試したい場合**: 一時的にガードを外して `next build && next start` で確認
- **iOS Safari**: 一部 PWA 機能（push 通知等）に制限あり。ホーム画面追加経由のみ動作する機能もある

## 関連ファイル

- `src/app/layout.tsx` — `PwaProvider` の mount
- `src/app/manifest.ts` — Web App Manifest
- `src/app/offline/page.tsx` — オフラインページ
