# シフトカレンダー

シフト管理とプライベートの予定管理を統合したWebアプリケーションです。ユーザーは勤務先の設定、シフトの登録、プライベートの予定をこのWebアプリケーション1つで管理できます。

## 機能・画面一覧
| ログイン画面 |　新規登録画面 |
| ---- | ---- |
| ![ログイン画面](./docs/login_page.png) | ![新規登録画面](./docs/signup_page.png) |
| この画面からログインできます。 | ユーザーの新規登録画面です。 |

| カレンダー画面 |　ユーザー設定画面 |
| ---- | ---- |
| ![カレンダー画面](./docs/calendar_page.png) | ![ユーザー設定画面](./docs/user-setting_page.png) |
| カレンダー画面です。ここから予定を追加したり確認したりできます。 | ユーザー情報の設定画面です。情報の確認、更新ができます。 |

| 予定の種類設定画面 |　勤務先設定画面 |
| ---- | ---- |
| ![予定の種類設定画面](./docs/event-labels-setting_page.png) | ![勤務先設定画面](./docs/workplace-setting_page.png) |
| 予定の種類を設定する画面です。追加、削除ができます | 勤務先の設定画面です。追加、更新、削除ができます。 |

- **ユーザー管理**: アカウント作成、ログイン、プロフィール設定
- **勤務先管理**: 勤務先の登録、編集、削除
- **シフト管理**: カレンダー形式でのシフト登録・編集・削除
- **予定管理**: 予定ラベル付きでのスケジュール管理
- **給与計算**: 時給ベースでの月次給与計算

## 技術スタック

### バックエンド
- **言語**: TypeScript
- **フレームワーク**: NestJS (Node.js)
- **ORM**: Prisma
- **認証**: JWT + bcrypt

### フロントエンド
- **言語**: TypeScript
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
│   │   ├── auth/            # 認証関連
│   │   ├── user/            # ユーザー管理
│   │   ├── workplace/       # 勤務先管理
│   │   ├── event/           # 予定管理
│   │   ├── event-label/     # 予定ラベル管理
│   │   └── prisma/          # データベース接続
│   ├── prisma/              # データベーススキーマ
│   └── Dockerfile
├── frontend/                # Next.js フロントエンド
│   ├── src/app/             # ページコンポーネント
│   ├── components/          # 再利用可能コンポーネント
│   └── Dockerfile
├── nginx/                   # Nginx設定
├── docker-compose.yml       # 開発環境用
└── docker-compose.prod.yml  # 本番環境用
```

## セットアップ

### 前提条件
- Docker と Docker Compose がインストールされていること
- Node.js 18+ がインストールされていること（ローカル開発用）

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd shift-calendar
```

### 2. 環境変数の設定
```bash
cp .env.sample .env
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
# 自分の環境に合わせて値を編集
```
#### バックエンド (backend/.env)
```env
# NestJS/Prisma接続用URL
# DATABASE_URL="mysql://[ユーザ名]:[パスワード]@[localhost or エンドポイントなど]:[ポート番号]/[データベース名]"
DATABASE_URL="mysql://user:password@localhost:3306/database"

# NestJSがリッスンするポート(フロントエンドが3000番を使うから3000以外を指定)
BACKEND_PORT = 8000

# APIリクエストを許可するフロントエンドのURL
CORS_ORIGIN = http://localhost:3000

# JWTの秘密鍵(予測されない文字列を入れる)
JWT_SECRET="your-jwt-secret"
```

#### フロントエンド (frontend/.env)
```env
# APIリクエストのエンドポイント
NEXT_PUBLIC_API_URL = http://localhost:8000
```

#### データベース (./env)
```env
MYSQL_ROOT_PASSWORD="root-password"
MYSQL_DATABASE="database-name"
MYSQL_USER="user"
MYSQL_PASSWORD="password"
```

### 3. Docker Compose での起動
```bash
docker compose up -d
```

これで以下のサービスが起動します：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:8000
- データベース: localhost:3308

### 4. データベースの初期化・準備
```bash
# バックエンドコンテナ内で実行
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma generate
```
```sql
# event_labelsテーブルにデータを追加
insert into event_labels (name, common) values ('予定', true), ('バイト', true);
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

### ER図
![ER図](./docs/entity-relationship-diagram.png)

### 主要なテーブル
- **users**: ユーザー情報
- **workplaces**: 勤務先情報
- **events**: イベント・シフト情報
- **event_labels**: イベントラベル

### リレーション
- ユーザー → 勤務先（1対多）
- ユーザー → 予定（1対多）
- ユーザー → 予定ラベル（1対多）
- 予定 → 予定ラベル（多対1）
- 予定 → 勤務先（多対1）

## 使用可能なスクリプト

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
docker compose up -d

# ログ確認
docker compose logs -f

# 特定サービスのログ
docker compose logs -f backend

# サービス停止
docker compose down

# ボリュームも含めて完全削除
docker compose down -v
```

## API エンドポイント

### 認証
- `POST /auth/login` - ログイン

### ユーザー
- `POST /create` - ユーザ登録
- `POST /getUser` - ユーザー情報取得
- `PUT /updateUser` - ユーザー情報更新

### 勤務先
- `POST /create` - 勤務先作成
- `GET /getWorkplace/:userId` - 勤務先一覧取得
- `GET /getWorkplaceWage/:workplaceId` - 勤務先の時給取得
- `PUT /updateWorkplace/:workplaceId` - 勤務先更新
- `DELETE /deleteWorkplace/:userId/:workplaceId` - 勤務先削除

### 予定
- `POST /create` - 予定作成
- `GET /getEvents/:userId` - 予定一覧取得
- `DELETE /deleteEvent/:userId/:id` - 予定削除

### 予定ラベル
- `POST /createLabel` - ラベル作成
- `GET /getLabels/:userId` - ラベル一覧取得
- `PUT /updateLabel/:userId/:labelId` - ラベル更新
- `DELETE /deleteLabel/:userId/:labelId` - ラベル削除

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

## デプロイ

### 本番環境用 Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d
```

## コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

問題が発生した場合や質問がある場合は、Issueを作成してください。
