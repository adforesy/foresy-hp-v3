# Foresy — GA4 月次レポート自動生成

GA4 Data API からデータを取得し、Foresyブランドの HTML レポートを自動生成します。

---

## 初回セットアップ（一度だけ）

### 1. Google Cloud プロジェクトの準備

1. [Google Cloud Console](https://console.cloud.google.com/) を開く
2. 新しいプロジェクトを作成（例: `foresy-reports`）
3. 左メニュー「APIとサービス」→「ライブラリ」→ **Google Analytics Data API** を有効化

### 2. サービスアカウントの作成

1. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービスアカウント」
2. 名前: `foresy-ga4` などわかりやすい名前で作成
3. 作成後、サービスアカウントをクリック → 「キー」タブ →「鍵を追加」→「JSON」
4. ダウンロードした JSON ファイルを `reports/service-account.json` として保存

### 3. クライアントの GA4 にサービスアカウントを追加

クライアントごとに以下を行う:

1. GA4 管理画面 → 「アカウントのアクセス管理」or「プロパティのアクセス管理」
2. ＋ボタン → 「ユーザーを追加」
3. サービスアカウントのメールアドレス（`xxx@foresy-reports.iam.gserviceaccount.com`）を**閲覧者**権限で追加

### 4. 環境変数の設定

```bash
cp .env.example .env
# .env を編集して GA4_SERVICE_ACCOUNT_JSON のパスを設定
```

### 5. 依存パッケージのインストール

```bash
npm install
```

---

## 毎月の実行手順

### 1. clients.json にクライアントを追加・確認

```json
[
  {
    "name": "〇〇整骨院",
    "slug": "client-abc",
    "propertyId": "123456789"
  }
]
```

`propertyId` は GA4 管理画面 → プロパティ設定 → プロパティ ID で確認。

### 2. レポート生成

```bash
node reports/generate.mjs
```

`reports/output/` に `{slug}-{YYYYMM}.html` が生成されます。

### 3. Vercel にデプロイ

```bash
vercel --prod
```

クライアントへの共有 URL 例:
```
https://foresy.vercel.app/reports/output/client-abc-202506.html
```

---

## ファイル構成

```
reports/
├── generate.mjs    ← 生成スクリプト（編集不要）
├── clients.json    ← クライアント設定（毎月確認）
├── README.md       ← このファイル
└── output/         ← 生成されたHTMLレポート（gitignore済み）
```

---

## クライアント追加時のチェックリスト

- [ ] `clients.json` にエントリを追加
- [ ] GA4 にサービスアカウントを閲覧者として追加
- [ ] `node reports/generate.mjs` で動作確認
- [ ] `vercel --prod` でデプロイ
- [ ] クライアントに URL を共有
