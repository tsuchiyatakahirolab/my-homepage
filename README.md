# tsuchiyatakahiro.com

Personal academic website for TSUCHIYA Takahiro. Built with Next.js 16, Tailwind CSS 4, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Latest News — Notion 連携ガイド

トップページに「Latest News」セクション、`/news` に全件アーカイブページがあります。
Notion をヘッドレス CMS として使い、掲載情報・メディア出演・論文・登壇情報を管理します。

---

### 先生側で必要な作業（Notion の設定）

以下はすべて Notion の Web UI で行います。コードの変更は不要です。

#### Step 1: Notion Integration を作成する

1. https://www.notion.so/profile/integrations を開く
2. 「新しいインテグレーション」をクリック
3. 設定:
   - **名前**: `tsuchiyatakahiro.com` など任意
   - **種類**: Internal（内部インテグレーション）
   - **機能**: 「コンテンツを読み取る」にチェック
4. 「送信」をクリック
5. **Internal Integration Secret** が表示されるのでコピーして安全に保管する
   - `ntn_` で始まる文字列です
   - これが `NOTION_TOKEN` になります

#### Step 2: ニュース用データベースを Notion に作成する

Notion で新しいページを作り、**データベース（テーブル）** を追加します。
以下のプロパティ（列）を設定してください:

| プロパティ名 (英語キー) | Notion での表示名 | 型 | 用途 |
|:--|:--|:--|:--|
| **Title** | タイトル | Title (タイトル) | 記事・出演・登壇のタイトル |
| **Date** | 日付 | Date (日付) | 掲載日・発表日 |
| **Category** | 区分 | Select (セレクト) | Media, Paper, Talk, Commentary など |
| **Outlet** | 掲載先・媒体 | Rich text (テキスト) | 新聞名、学会名、TV 番組名など |
| **URL** | リンク | URL | 元記事・論文へのリンク |
| **Summary** | 概要 | Rich text (テキスト) | 短い説明（任意、一覧ページで表示） |
| **Language** | 言語 | Select (セレクト) | `ja` または `en`（任意） |
| **ShowOnHome** | トップ表示 | Checkbox (チェック) | トップページに表示するかどうか |
| **Published** | 公開 | Checkbox (チェック) | サイトに表示するかどうか |
| **SortOrder** | 表示順 | Number (数値) | 同日の表示順（任意、小さい順） |
| **Featured** | 注目表示 | Checkbox (チェック) | 将来の拡張用（任意） |

> **重要**: プロパティ名は英語キー（Title, Date, Category...）を正確に使ってください。
> Notion の UI 上の表示名は日本語で構いませんが、API で取得する際は英語キーが使われます。

#### Step 3: Integration をデータベースに共有する

1. 作成したデータベースのページを開く
2. 右上の `…` メニューをクリック
3. 「接続先」→ Step 1 で作った Integration 名を選択して追加

> **よくある失敗**: この共有を忘れると、API からアクセスできず 404 エラーになります。

#### Step 4: Data Source ID をコピーする

1. Notion でデータベースを開く
2. ブラウザの URL を確認:
   ```
   https://www.notion.so/<ワークスペース>/<DATA_SOURCE_ID>?v=...
   ```
3. `<DATA_SOURCE_ID>` の部分（32 文字の英数字、ハイフン付き or なし）をコピー
4. これが `NOTION_DATA_SOURCE_ID` になります

#### Step 5: テスト記事を作成する

データベースに 1〜3 件のテスト記事を作成し、以下を確認:
- `Published` にチェックが入っている
- `ShowOnHome` にチェックが入っている（トップに出したい記事のみ）
- `Date` が設定されている

---

### コードベース / Claude Code 側で行う作業

#### 環境変数の設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

以下を記入:

| 変数名 | 必須 | 値の取得元 |
|:--|:--|:--|
| `NOTION_TOKEN` | 必須 | Step 1 の Internal Integration Secret |
| `NOTION_DATA_SOURCE_ID` | 必須（推奨） | Step 4 の Data Source ID |
| `NOTION_DATABASE_ID` | 任意（互換） | 上と同じ ID。`NOTION_DATA_SOURCE_ID` が未設定時のフォールバック |
| `NOTION_WEBHOOK_SECRET` | 任意 | Webhook を使う場合の verification_token |

> **`NOTION_DATA_SOURCE_ID` と `NOTION_DATABASE_ID`の違い**:
> Notion SDK v5 では `dataSources.query` API を使います。
> 多くの場合、original database の ID はそのまま data source ID として機能します。
> `NOTION_DATA_SOURCE_ID` を優先し、未設定時のみ `NOTION_DATABASE_ID` にフォールバックします。

#### ローカル確認手順

```bash
npm run dev
```

1. http://localhost:3000 を開く
2. Areas of Expertise セクションの下に「Latest News」が表示される
3. Notion にテスト記事があれば最新 3 件が表示される
4. http://localhost:3000/news で全件アーカイブを確認
5. env 未設定の場合は静かなフォールバックメッセージが表示される（ページは壊れない）

#### 本番環境（Vercel）での設定

1. Vercel ダッシュボード → プロジェクト → Settings → Environment Variables
2. 以下を追加:
   - `NOTION_TOKEN` = Integration Secret
   - `NOTION_DATA_SOURCE_ID` = Data Source ID
3. Redeploy する

#### 本番環境（Cloudflare Workers）での設定

```bash
wrangler secret put NOTION_TOKEN
wrangler secret put NOTION_DATA_SOURCE_ID
```

---

### データの更新方式

| 方式 | 説明 |
|:--|:--|
| **自動 (revalidate)** | API ルートは 5 分ごとに Notion を再取得します。特別な設定は不要です。 |
| **手動 (webhook)** | Notion webhook を設定すると、データベース更新時に即座にサイトを更新できます。 |

#### Webhook を使う場合（任意）

1. Notion webhook subscription を登録する
2. 登録時に受け取る **verification_token** を `NOTION_WEBHOOK_SECRET` に設定する
3. Webhook の送信先 URL を `https://tsuchiyatakahiro.com/api/revalidate` に設定する

**仕組み**:
- Notion がデータベース更新時に POST リクエストを送信
- `/api/revalidate` が `X-Notion-Signature` ヘッダーを verification_token で **HMAC-SHA256 検証**
- 検証成功後、ホームページと `/news` の再取得をトリガー
- 次回アクセス時に Notion API から最新データを取得（webhook payload 自体からデータを読むのではなく、イベントを「更新シグナル」として受け取り、Notion API を再取得する設計です）

---

### トラブルシューティング

| 症状 | 原因 | 対処 |
|:--|:--|:--|
| ニュースが表示されない（フォールバック表示） | env 未設定 / Integration 未共有 | `.env.local` を確認、Step 3 を再実施 |
| 403 エラー | Integration がデータベースに共有されていない | Notion でデータベースの「接続先」に Integration を追加 |
| 空のリストが表示される | `Published` チェックが入っていない | Notion でチェックを入れる |
| トップに表示されない | `ShowOnHome` チェックが入っていない | Notion でチェックを入れる |
| ID の取り違え | database ID ではなく view ID をコピーした | URL の `?v=` より前の部分が正しい ID |

---

### 技術仕様（開発者向け）

**Section 配置**: `#expertise` (Areas of Expertise) と `#research` (Research & Publications) の間

**Layout**: Research セクションが左=ビジュアル・右=テキストなので、Latest News は左=テキスト・右=ビジュアルに反転し、視線の流れに変化を出しています。

**API**: `dataSources.query` (Notion SDK v5) を使用。`databases.query` は非推奨。

**ファイル構成**:
- `src/lib/notion.ts` — Notion クライアント、型定義、クエリ関数
- `src/components/LatestNewsSection.tsx` — トップページ Latest News セクション
- `src/app/news/page.tsx` — `/news` アーカイブページ
- `src/app/api/news/route.ts` — ニュースデータ API（5 分 revalidate）
- `src/app/api/revalidate/route.ts` — Webhook 受信エンドポイント

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
