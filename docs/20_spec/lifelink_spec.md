# LifeLink Specification (working draft)

This document is a **LifeLink-branded** adaptation of the previous "Eternal Link - 完全仕様書".
It preserves the original technical intent, while aligning the product framing to:

> **LifeLink — Your links. Your story. Your self.**

---

## 0. Positioning
LifeLink is not “memorial-only”. It supports **life-first journaling and reflection**, and continues seamlessly into memorial and inheritance.

The feature set is organized by:
- **Links**: family lineage + communities + real-world bridges
- **Story**: memorial profiles + media + timeline + message capsules
- **Self**: reflection and self-rediscovery flows

---

## 1. Project overview (ported & re-framed)
# 1. プロジェクト概要

## 1.1 プロジェクト名

**Eternal Link（エターナルリンク）**

**タグライン**: 「永遠に続く絆を、デジタルで」

## 1.2 ビジョン・ミッション

### ビジョン
人々の大切な思い出と存在を次世代につなぎ、デジタル時代における新しい形の記憶継承を実現する。

### ミッション
1. 従来のお墓や供養の経済的・物理的負担を軽減する
2. デジタル資産の散逸を防ぎ、適切に管理・継承する
3. 世代を超えた家族の絆を深める
4. 持続可能で意義深い「存在の継承」を可能にする

## 1.3 プロジェクトの目的

### 解決する社会課題
- **従来のお墓の問題**: 高額費用（平均200万円）、維持管理の負担、継承の困難さ
- **デジタル遺産の散逸**: SNS、写真、メッセージなどの重要な記録が失われる
- **世代間断絶**: 先祖や家族の歴史が継承されない
- **終活の複雑さ**: 遺言、供養、資産管理が煩雑で統合されていない

### 提供する価値
- **経済的**: 従来のお墓の1/10以下のコスト
- **利便性**: いつでもどこでもアクセス可能
- **永続性**: クラウドによる半永久的な保存
- **多様性**: 写真、動画、音声、文章など多様な形式に対応
- **プライバシー**: 5段階の柔軟な公開範囲設定

## 1.4 ターゲット市場

### プライマリターゲット
- **40-60代（終活意識層）**
  - 人口: 約4,300万人
  - 特徴: 終活への関心が高い、デジタルに抵抗感が減少
  - ニーズ: 遺産整理、家族への思い出継承

### セカンダリターゲット
- **30-40代（子育て世代）**
  - 人口: 約2,800万人
  - 特徴: デジタルネイティブ、家族との絆重視
  - ニーズ: 子供へのメッセージ、写真整理

### ターシャリターゲット
- **60代以上（シニア層）**
  - 人口: 約4,000万人
  - 特徴: 終活実行段階、デジタル支援必要
  - ニーズ: シンプルな操作、家族との共有

---

---

## 2. System architecture (from original spec)
# 3. システムアーキテクチャ

## 3.1 全体アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    クライアント層                          │
├─────────────────────────────────────────────────────────┤
│  Web Browser (PC/Tablet)  │  Mobile App (iOS/Android)   │
│  - Next.js 14 SSR/SSG     │  - React Native             │
│  - Progressive Web App     │  - Native APIs              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ HTTPS / WebSocket
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   CDN / Load Balancer                     │
│              Cloudflare / AWS CloudFront                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   アプリケーション層                        │
├─────────────────────────────────────────────────────────┤
│  Next.js 14 App Router                                   │
│  ├─ API Routes (REST)                                    │
│  ├─ Server Components                                    │
│  ├─ Server Actions                                       │
│  └─ Middleware (認証・認可)                               │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┬────────────┐
        ▼                   ▼             ▼            ▼
┌──────────────┐  ┌──────────────┐  ┌─────────┐  ┌─────────┐
│ 認証サービス    │  │ ファイル処理  │  │ AI処理  │  │ 決済    │
│ NextAuth.js   │  │ Sharp/FFmpeg │  │ OpenAI  │  │ Stripe  │
└──────────────┘  └──────────────┘  └─────────┘  └─────────┘
                  │
        ┌─────────┴─────────┬─────────────┬────────────┐
        ▼                   ▼             ▼            ▼
┌──────────────┐  ┌──────────────┐  ┌─────────┐  ┌─────────┐
│ データベース    │  │ キャッシュ    │  │ 検索    │  │ 監視    │
│ PostgreSQL    │  │ Redis        │  │ Elastic │  │ Datadog │
└──────────────┘  └──────────────┘  └─────────┘  └─────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   ストレージ層                             │
├─────────────────────────────────────────────────────────┤
│  AWS S3 / Cloudflare R2                                  │
│  ├─ 標準ストレージ (頻繁アクセス)                           │
│  ├─ Intelligent-Tiering (最適化)                         │
│  └─ Glacier Deep Archive (長期保存)                       │
└─────────────────────────────────────────────────────────┘
```

## 3.2 技術スタック詳細

### フロントエンド
```yaml
フレームワーク:
  - Next.js: 14.0.4 (App Router)
  - React: 18.2.0
  - TypeScript: 5.x

UI/スタイリング:
  - Tailwind CSS: 3.3.0
  - shadcn/ui: latest
  - Radix UI: 各種コンポーネント
  - Lucide React: アイコンライブラリ

状態管理:
  - Zustand: 4.4.7 (軽量な状態管理)
  - React Query: キャッシュ管理

フォーム・バリデーション:
  - React Hook Form: フォーム管理
  - Zod: 3.22.4 (スキーマバリデーション)

3D/グラフィックス:
  - Three.js: 3D供養空間
  - React Three Fiber: React統合
  - D3.js: 家系図可視化
```

### バックエンド
```yaml
ランタイム:
  - Node.js: 18.x LTS

API:
  - Next.js API Routes (REST)
  - Next.js Server Actions (RPC)
  - tRPC: 型安全なAPI（検討中）

データベース:
  - PostgreSQL: 15.x (メインDB)
  - Prisma ORM: 5.8.0
  - MongoDB: メディアメタデータ（検討中）

キャッシュ:
  - Redis: 7.x
  - Redis Stack: JSON・検索機能

認証:
  - NextAuth.js: 4.24.5
  - bcryptjs: 2.4.3 (パスワードハッシュ)
  - jose: JWT処理

ファイル処理:
  - Sharp: 画像処理
  - FFmpeg: 動画処理
  - pdfkit: PDF生成
```

### AI/機械学習
```yaml
テキスト生成:
  - OpenAI GPT-4 API
  - Claude 3 (代替案)

音声合成:
  - ElevenLabs API
  - Google Cloud TTS (代替案)

画像生成:
  - Stable Diffusion
  - DALL-E 3 (高品質用)

顔認識:
  - AWS Rekognition
  - Face-api.js (クライアント側)
```

### インフラ
```yaml
ホスティング:
  - Vercel (推奨)
  - AWS EC2 + ECS (代替案)

データベース:
  - Supabase (推奨)
  - AWS RDS (スケール時)
  - Neon (代替案)

ストレージ:
  - AWS S3 (メイン)
  - Cloudflare R2 (コスト最適化)

CDN:
  - Cloudflare (グローバル配信)
  - AWS CloudFront (代替案)

監視・ログ:
  - Datadog (APM)
  - Sentry (エラー追跡)
  - Vercel Analytics (標準)
```

## 3.3 スケーラビリティ設計

### 水平スケーリング
- **アプリケーションサーバー**: Kubernetes/AWS ECSによる自動スケーリング
- **データベース**: リードレプリカによる読み取り負荷分散
- **キャッシュ**: Redis Clusterによる分散キャッシュ

### 垂直スケーリング
- **データベース**: インスタンスサイズの段階的アップグレード
- **ストレージ**: 無制限の拡張可能性

### パフォーマンス目標
- **ページ読み込み**: < 2秒 (FCP)
- **API応答時間**: < 200ms (P95)
- **画像配信**: < 100ms (CDN経由)
- **同時接続数**: 10,000+ (初期)、100,000+ (スケール後)

---

---

## 3. Tech stack (from original spec)
# 6. 技術スタック

## 6.1 開発環境

### 必須ツール
- Node.js: 18.x LTS以上
- npm: 9.x以上 または yarn: 1.22.x以上
- Git: 2.x以上
- PostgreSQL: 15.x以上
- Redis: 7.x以上（開発時はローカル、本番はクラウド）

### 推奨エディタ
- Visual Studio Code
  - 拡張機能:
    - ESLint
    - Prettier
    - Prisma
    - Tailwind CSS IntelliSense
    - GitLens

### 開発用データベース
- Docker Composeで構築
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: eternal_link_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 6.2 コーディング規約

### TypeScript
- 厳格な型チェック有効化
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 命名規則
- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **コンポーネント**: PascalCase（例: `UserProfile`）
- **関数・変数**: camelCase（例: `getUserData`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_FILE_SIZE`）
- **型・インターフェース**: PascalCase（例: `UserData`）

### コメント規約
```typescript
/**
 * ユーザープロフィールを取得する
 * @param userId - ユーザーID
 * @returns ユーザープロフィールデータ
 * @throws {NotFoundError} ユーザーが見つからない場合
 */
async function getUserProfile(userId: string): Promise<UserProfile> {
  // 実装...
}
```

## 6.3 テスト戦略

### テストピラミッド
```
        /\
       /E2E\        <- 10% (重要フロー)
      /──────\
     /Integration\ <- 20% (API・DB)
    /────────────\
   /  Unit Tests  \ <- 70% (ロジック)
  /────────────────\
```

### テストツール
- **Unit**: Jest + React Testing Library
- **Integration**: Jest + Supertest
- **E2E**: Playwright
- **カバレッジ目標**: 80%以上

### テスト例
```typescript
// Unit Test
describe('calculateAge', () => {
  it('正しく年齢を計算する', () => {
    const birthDate = new Date('1990-01-01')
    const age = calculateAge(birthDate)
    expect(age).toBe(34) // 2024年基準
  })
})

// Integration Test
describe('POST /api/auth/register', () => {
  it('新規ユーザーを登録できる', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User'
      })
    
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('user.id')
  })
})
```

## 6.4 CI/CD パイプライン

### GitHub Actions ワークフロー
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

---

## 4. Links / Story / Self functional map (high level)

### Links
- Family graph & invitations
- Communities (relatives / attributes)
- Virtual visit & online ceremony integrations
- QR bridge to memorial/story pages

### Story
- Life profile & memorial page
- Media library (photo/video/audio/docs)
- Timeline & life log
- Future letters (scheduled / conditional / after-death)

### Self
- Guided reflection prompts
- Life review templates
- Optional AI assist (summaries, timeline extraction, question generation)

---

## 5. Source documents
- `docs/20_spec/source/ETERNAL_LINK_SPECIFICATION.md` (archived original)
- `docs/10_requirements/requirements_core.md` (distilled requirements)
