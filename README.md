# シフトカレンダー

シフト管理とプライベートの予定管理を統合したWebアプリケーションです。ユーザーは勤務先の設定、シフトの登録、イベントの管理を行うことができます。

## 機能

- **ユーザー管理**: アカウント作成、ログイン、プロフィール設定
- **勤務先管理**: 勤務先の登録、編集、削除
- **シフト管理**: カレンダー形式でのシフト登録・編集・削除
- **イベント管理**: イベントラベル付きでのスケジュール管理
- **給与計算**: 時給ベースでの月次給与計算

## 技術スタック

### バックエンド
- **フレームワーク**: NestJS (Node.js)
- **データベース**: MySQL 8.0
- **ORM**: Prisma
- **認証**: JWT + bcrypt
- **言語**: TypeScript

### フロントエンド
- **フレームワーク**: Next.js 15
- **UI**: React 19 + Tailwind CSS
- **カレンダー**: react-calendar
- **HTTP クライアント**: Fetch API

### インフラ
- **コンテナ化**: Docker + Docker Compose
- **リバースプロキシ**: Nginx
- **データベース**: MySQL 8.0

## プロジェクト構造

```
blog_app/
├── backend/                 # NestJS バックエンド
│   ├── src/
│   │   ├── auth/          # 認証関連
│   │   ├── user/          # ユーザー管理
│   │   ├── workplace/     # 勤務先管理
│   │   ├── event/         # イベント管理
│   │   ├── event-label/   # イベントラベル管理
│   │   └── prisma/        # データベース接続
│   ├── prisma/            # データベーススキーマ
│   └── Dockerfile
├── frontend/               # Next.js フロントエンド
│   ├── src/app/           # ページコンポーネント
│   ├── components/        # 再利用可能コンポーネント
│   └── Dockerfile
├── nginx/                  # Nginx設定
└── docker-compose.yml      # 開発環境用
```

## セットアップ

### 前提条件
- Docker と Docker Compose がインストールされていること
- Node.js 18+ がインストールされていること（ローカル開発用）

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd blog_app
```

### 2. 環境変数の設定
```bash
# バックエンド用
cp backend/.env.example backend/.env
# 必要に応じて値を編集
```

### 3. Docker Compose での起動
```bash
docker-compose up -d
```

これで以下のサービスが起動します：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:8000
- データベース: localhost:3308

### 4. データベースの初期化
```bash
# バックエンドコンテナ内で実行
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma generate
```

## 🛠️ 開発

### バックエンド開発
```bash
cd backend
npm install
npm run start:dev
```

### フロントエンド開発
```bash
cd frontend
npm install
npm run dev
```

### データベース管理
```bash
# Prisma Studio の起動
cd backend
npx prisma studio
```

## データベーススキーマ

### 主要なテーブル
- **users**: ユーザー情報
- **workplaces**: 勤務先情報
- **events**: イベント・シフト情報
- **event_labels**: イベントラベル

### リレーション
- ユーザー → 勤務先（1対多）
- ユーザー → イベント（1対多）
- ユーザー → イベントラベル（1対多）
- イベント → イベントラベル（多対1）
- イベント → 勤務先（多対1）

## 🔧 使用可能なスクリプト

### バックエンド
```bash
npm run start          # 本番モードで起動
npm run start:dev      # 開発モードで起動（ホットリロード）
npm run build          # ビルド
npm run test           # テスト実行
npm run test:e2e       # E2Eテスト実行
```

### フロントエンド
```bash
npm run dev            # 開発サーバー起動
npm run build          # ビルド
npm run start          # 本番サーバー起動
npm run lint           # リンター実行
```

## Docker コマンド

```bash
# 全サービス起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 特定サービスのログ
docker-compose logs -f backend

# サービス停止
docker-compose down

# ボリュームも含めて完全削除
docker-compose down -v
```

## API エンドポイント

### 認証
- `POST /auth/login` - ログイン
- `POST /auth/signup` - ユーザー登録

### ユーザー
- `GET /user` - ユーザー情報取得
- `PUT /user` - ユーザー情報更新

### 勤務先
- `GET /workplace` - 勤務先一覧取得
- `POST /workplace` - 勤務先作成
- `PUT /workplace/:id` - 勤務先更新
- `DELETE /workplace/:id` - 勤務先削除

### イベント
- `GET /event` - イベント一覧取得
- `POST /event` - イベント作成
- `PUT /event/:id` - イベント更新
- `DELETE /event/:id` - イベント削除

### イベントラベル
- `GET /event-label` - ラベル一覧取得
- `POST /event-label` - ラベル作成
- `PUT /event-label/:id` - ラベル更新
- `DELETE /event-label/:id` - ラベル削除

## テスト

```bash
# バックエンド
cd backend
npm run test           # ユニットテスト
npm run test:e2e       # E2Eテスト
npm run test:cov       # カバレッジ付きテスト

# フロントエンド
cd frontend
npm run test           # テスト実行（設定されている場合）
```

## 環境変数

### バックエンド (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
JWT_SECRET="your-jwt-secret"
MYSQL_ROOT_PASSWORD="root-password"
MYSQL_DATABASE="database-name"
MYSQL_USER="user"
MYSQL_PASSWORD="password"
```

## デプロイ

### 本番環境用 Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## サポート

問題が発生した場合や質問がある場合は、Issueを作成してください。

---

**注意**: このアプリケーションは開発・学習目的で作成されています。本格的な運用を行う場合は、セキュリティ、パフォーマンス、スケーラビリティの観点から追加の検討が必要です。