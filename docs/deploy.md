# LifeLink — Vercel デプロイ手順

## 前提
- GitHub アカウント
- Vercel アカウント（GitHub 連携済み）
- Neon アカウント（無料）または Vercel Postgres

---

## Step 1: GitHub リポジトリを作成・プッシュ

```bash
# GitHub で新規リポジトリを作成後:
git remote add origin https://github.com/<your-name>/lifelink.git
git branch -M main
git push -u origin main
```

---

## Step 2: Neon で PostgreSQL DB を作成

1. https://neon.tech にアクセス → 無料プランで新規プロジェクト作成
2. 「Connection string」をコピー（`postgresql://...` 形式）

または Vercel Postgres (Vercel ダッシュボード → Storage → Create Database)

---

## Step 3: スキーマを PostgreSQL に切り替え

```bash
# schema.postgresql.prisma の内容を schema.prisma にコピー
cp packages/db/prisma/schema.postgresql.prisma packages/db/prisma/schema.prisma

# 本番 DB にテーブルを作成
DATABASE_URL="postgresql://..." npx prisma db push --schema packages/db/prisma/schema.prisma
```

---

## Step 4: Vercel にプロジェクトをインポート

1. https://vercel.com/new → 「Import Git Repository」
2. リポジトリを選択
3. **Framework Preset**: Next.js（自動検出）
4. **Root Directory**: `.`（ルートのまま）
   - `vercel.json` が buildCommand を自動適用します
5. 「Deploy」

---

## Step 5: Vercel で環境変数を設定

Vercel ダッシュボード → プロジェクト → Settings → Environment Variables:

| 変数名 | 値 |
|---|---|
| `DATABASE_URL` | Step 2 でコピーした postgresql:// URL |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` で生成したランダム文字列 |
| `NEXTAUTH_URL` | `https://your-app.vercel.app`（デプロイ後の URL） |

設定後「Redeploy」。

---

## Step 6: 動作確認

- `/register` でアカウント作成
- `/login` でログイン
- `/self`, `/story`, `/links` のデータが DB に保存されることを確認

---

## ローカル開発に戻す場合

`packages/db/prisma/schema.prisma` の `provider` が `"sqlite"` になっていることを確認し、
`apps/web/.env.local` の `DATABASE_URL` が `file:../../packages/db/prisma/dev.db` になっていることを確認。
