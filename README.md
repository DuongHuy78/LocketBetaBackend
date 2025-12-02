# Locket Beta Backend

## English Version

### Project Overview

Locket Beta Backend is a comprehensive Node.js and Express-based API server designed to support a modern social media and real-time communication platform. The backend provides robust authentication, user management, friend networking, real-time messaging, photo sharing, and recommendation features. Built with MongoDB and WebSocket technology, it enables seamless real-time interactions between users.

### Key Features and Modules

**Authentication and Authorization**
The authentication module handles user registration, login, logout, and token refresh using JWT (JSON Web Tokens) and bcrypt password encryption. It includes password reset functionality with secure token-based recovery and email verification via Nodemailer.

**User Management**
Complete user profile management system allowing users to create accounts, update profiles, manage avatars via Cloudinary cloud storage, and maintain bio information. The module supports user discovery and profile data retrieval.

**Friend Network**
Comprehensive friend management system enabling users to add friends, manage friend lists, and maintain social relationships. The system includes friend request handling with acceptance and rejection capabilities, facilitating smooth social networking experiences.

**Real-time Messaging**
WebSocket-based instant messaging system providing live chat functionality. Users can engage in one-on-one conversations with real-time message delivery, message history retrieval, and presence detection. The system maintains connection state and message synchronization.

**Chat Management**
Chat session management system organizing conversations between users. Each chat session stores member information, last message context, and timestamps for efficient conversation tracking and retrieval.

**Photo Sharing**
Media management module integrated with Cloudinary for image hosting and storage. Users can upload, manage, and share photos with automatic cloud storage optimization and URL generation.

**Friend Recommendations**
Intelligent recommendation engine suggesting potential friends based on user profiles and social connections. This module enhances network growth and user engagement by facilitating meaningful connections.

**Middleware and Security**
Comprehensive middleware layer including JWT authentication verification, file upload handling with Multer, and CORS configuration. These ensure secure API access and proper request validation.

### Project Structure

```
LocketBetaBackend/
  .env                          Environment variables configuration
  package.json                  Project dependencies and scripts
  src/
    server.js                   Main application entry point with Express setup
    config/
      cloudinary.config.js      Cloudinary image hosting configuration
      database.js               MongoDB connection setup
    controller/
      user_controller.js        User profile management
      photo_controller.js       Photo upload and management
      chat_controller.js        Chat session operations
      message_controller.js     Real-time messaging and WebSocket handling
      friend_controller.js      Friend list and relationship management
      friendRequest_controller.js    Friend request operations
      recommendation_controller.js   Friend recommendation logic
      auth/
        auth_controller.js      Core authentication logic
        login_controller.js     Login functionality
        register_controller.js  User registration
        logout_controller.js    Logout and session cleanup
        refresh_controller.js   Token refresh operations
        forgot_password_controller.js    Password recovery
    libs/
      db.js                     Database connection utilities
    middleware/
      auth.js                   JWT authentication middleware
      upload.js                 Multer file upload configuration
    models/
      User.js                   User document schema and validation
      Chat.js                   Chat session schema
      Message.js                Message document schema
      Friend.js                 Friend relationship schema
      FriendRequest.js          Friend request document schema
      photo.js                  Photo metadata schema
    routes/
      auth_routes.js            Authentication endpoints
      user_routes.js            User management endpoints
      chat_router.js            Chat operation endpoints
      message_router.js         Messaging endpoints with WebSocket
      photo_routes.js           Photo upload and retrieval endpoints
      friend_routes.js          Friend management endpoints
      friendRequest_routes.js   Friend request endpoints
      recommendation_routes.js  Friend recommendation endpoints
    scripts/
      seed.js                   Database seeding for development
    uploads/                    Local file storage directory
```

### Installation

**Prerequisites**
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- MongoDB (local instance or MongoDB Atlas cloud database)
- Cloudinary account (for image hosting)

**Step 1: Clone and Setup**
```bash
git clone <repository-url>
cd LocketBetaBackend
npm install
```

**Step 2: Environment Configuration**
Create a `.env` file in the project root directory:
```
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/LocketBeta
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Step 3: Database Setup**
```bash
# Ensure MongoDB is running locally or use MongoDB Atlas
# For local MongoDB on Windows, ensure the MongoDB service is running
mongod

# Optional: Seed development data
npm run seed
```

### Running the Backend

**Development Mode (with auto-reload)**
```bash
npm run dev
```
The server will start with Nodemon watching for file changes and auto-restarting.

**Production Mode**
```bash
npm start
```
The server will run without file watching.

The API will be available at `http://localhost:8000`
WebSocket endpoint: `ws://localhost:8000`

### Main API Endpoints

**Authentication**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- POST `/api/auth/refresh` - Refresh JWT token
- POST `/api/auth/forgot-password` - Request password reset

**Users**
- GET `/api/users/:id` - Retrieve user profile
- PUT `/api/users/:id` - Update user profile
- GET `/api/users` - List users

**Photos**
- POST `/api/photos` - Upload photo
- GET `/api/photos/:id` - Retrieve photo
- DELETE `/api/photos/:id` - Delete photo

**Friends**
- GET `/api/friends` - Get friend list
- POST `/api/friends/:userId` - Add friend
- DELETE `/api/friends/:userId` - Remove friend

**Friend Requests**
- POST `/api/friend-requests/:userId` - Send friend request
- PUT `/api/friend-requests/:requestId/accept` - Accept request
- PUT `/api/friend-requests/:requestId/reject` - Reject request

**Messages**
- GET `/api/messages/:chatId` - Retrieve message history
- POST `/api/messages` - Send message (WebSocket for real-time)

**Chats**
- GET `/api/chats` - List user chats
- POST `/api/chats` - Create new chat

**Recommendations**
- GET `/api/recommendations` - Get friend recommendations

### Team Members

- Le Duong Huy
- Tran Quoc Dat
- Tang Ngoc Hau
- Nguyen Tuan Ngoc

### License

ISC License

---

## Japanese Version (日本語版)

### プロジェクト概要

Locket Beta Backendは、最新のソーシャルメディアおよびリアルタイム通信プラットフォームをサポートするために設計された、Node.jsおよびExpressベースの包括的なAPIサーバーです。バックエンドは、堅牢な認証、ユーザー管理、友達ネットワーク、リアルタイムメッセージング、写真共有、および推奨機能を提供します。MongoDBおよびWebSocketテクノロジーで構築され、ユーザー間のシームレスなリアルタイムインタラクションを実現します。

### 主な機能とモジュール

**認証と認可**
認証モジュールは、JWT（JSON Web Tokens）とbcrypt パスワード暗号化を使用したユーザー登録、ログイン、ログアウト、およびトークン更新を処理します。セキュアなトークンベースのリカバリーと Nodemailer を介したメール検証を含むパスワードリセット機能が含まれています。

**ユーザー管理**
ユーザーがアカウントを作成し、プロフィールを更新し、Cloudinary クラウドストレージを介してアバターを管理し、自己紹介情報を維持できる完全なユーザープロフィール管理システム。ユーザーディスカバリーおよびプロフィールデータ取得をサポートします。

**友達ネットワーク**
ユーザーが友達を追加し、友達リストを管理し、社会的関係を維持できるようにする包括的な友達管理システム。このシステムには、受け入れと拒否の機能を備えた友達リクエスト処理が含まれており、スムーズなソーシャルネットワーキング体験を促進します。

**リアルタイムメッセージング**
WebSocket ベースのインスタントメッセージングシステムが、ライブチャット機能を提供します。ユーザーは、リアルタイムメッセージ配信、メッセージ履歴取得、および在席検出を備えた一対一の会話に従事できます。システムは接続状態とメッセージ同期を維持します。

**チャット管理**
ユーザー間の会話を整理するチャットセッション管理システム。各チャットセッションはメンバー情報、最後のメッセージコンテキスト、および効率的な会話トラッキングと取得のためのタイムスタンプを保存します。

**写真共有**
Cloudinary と統合されたメディア管理モジュール、画像ホスティングおよびストレージ用。ユーザーは、自動クラウドストレージの最適化と URL 生成を備えた写真をアップロード、管理、および共有できます。

**友達推奨**
ユーザープロフィールおよび社会的接続に基づいて潜在的な友達を提案するインテリジェント推奨エンジン。このモジュールは、意味のある接続を促進することにより、ネットワーク成長とユーザーエンゲージメントを向上させます。

**ミドルウェアとセキュリティ**
JWT 認証検証、Multer ファイルアップロード処理、および CORS 構成を含む包括的なミドルウェアレイヤー。これらは安全な API アクセスと適切なリクエスト検証を確保します。

### プロジェクト構造

```
LocketBetaBackend/
  .env                          環境変数設定
  package.json                  プロジェクト依存関係とスクリプト
  src/
    server.js                   Express セットアップを備えたメインアプリケーションエントリポイント
    config/
      cloudinary.config.js      Cloudinary 画像ホスティング設定
      database.js               MongoDB 接続設定
    controller/
      user_controller.js        ユーザープロフィール管理
      photo_controller.js       写真アップロードおよび管理
      chat_controller.js        チャットセッション操作
      message_controller.js     リアルタイムメッセージングおよび WebSocket 処理
      friend_controller.js      友達リストおよび関係管理
      friendRequest_controller.js    友達リクエスト操作
      recommendation_controller.js   友達推奨ロジック
      auth/
        auth_controller.js      コア認証ロジック
        login_controller.js     ログイン機能
        register_controller.js  ユーザー登録
        logout_controller.js    ログアウトおよびセッションクリーンアップ
        refresh_controller.js   トークン更新操作
        forgot_password_controller.js    パスワード回復
    libs/
      db.js                     データベース接続ユーティリティ
    middleware/
      auth.js                   JWT 認証ミドルウェア
      upload.js                 Multer ファイルアップロード設定
    models/
      User.js                   ユーザードキュメントスキーマおよび検証
      Chat.js                   チャットセッションスキーマ
      Message.js                メッセージドキュメントスキーマ
      Friend.js                 友達関係スキーマ
      FriendRequest.js          友達リクエストドキュメントスキーマ
      photo.js                  写真メタデータスキーマ
    routes/
      auth_routes.js            認証エンドポイント
      user_routes.js            ユーザー管理エンドポイント
      chat_router.js            チャット操作エンドポイント
      message_router.js         メッセージングエンドポイント (WebSocket 対応)
      photo_routes.js           写真アップロードおよび取得エンドポイント
      friend_routes.js          友達管理エンドポイント
      friendRequest_routes.js   友達リクエストエンドポイント
      recommendation_routes.js  友達推奨エンドポイント
    scripts/
      seed.js                   開発用データベースシーディング
    uploads/                    ローカルファイルストレージディレクトリ
```

### インストール

**前提条件**
- Node.js（バージョン 18 以上）
- npm（Node.js に含まれています）
- MongoDB（ローカルインスタンスまたは MongoDB Atlas クラウドデータベース）
- Cloudinary アカウント（画像ホスティング用）

**ステップ 1: クローンとセットアップ**
```bash
git clone <repository-url>
cd LocketBetaBackend
npm install
```

**ステップ 2: 環境設定**
プロジェクトルートディレクトリに `.env` ファイルを作成します:
```
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/LocketBeta
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**ステップ 3: データベースセットアップ**
```bash
# MongoDB がローカルで実行されているか、MongoDB Atlas を使用していることを確認します
# Windows でローカル MongoDB を使用する場合、MongoDB サービスが実行されていることを確認します
mongod

# オプション: 開発データをシード処理
npm run seed
```

### バックエンド実行方法

**開発モード（自動リロード機能付き）**
```bash
npm run dev
```
サーバーが Nodemon で起動し、ファイルの変更を監視して自動的に再起動します。

**本番モード**
```bash
npm start
```
サーバーはファイル監視なしで実行されます。

API は `http://localhost:8000` で利用可能です
WebSocket エンドポイント: `ws://localhost:8000`

### メイン API エンドポイント

**認証**
- POST `/api/auth/register` - ユーザー登録
- POST `/api/auth/login` - ユーザーログイン
- POST `/api/auth/logout` - ユーザーログアウト
- POST `/api/auth/refresh` - JWT トークン更新
- POST `/api/auth/forgot-password` - パスワードリセット要求

**ユーザー**
- GET `/api/users/:id` - ユーザープロフィール取得
- PUT `/api/users/:id` - ユーザープロフィール更新
- GET `/api/users` - ユーザー一覧

**写真**
- POST `/api/photos` - 写真アップロード
- GET `/api/photos/:id` - 写真取得
- DELETE `/api/photos/:id` - 写真削除

**友達**
- GET `/api/friends` - 友達リスト取得
- POST `/api/friends/:userId` - 友達追加
- DELETE `/api/friends/:userId` - 友達削除

**友達リクエスト**
- POST `/api/friend-requests/:userId` - 友達リクエスト送信
- PUT `/api/friend-requests/:requestId/accept` - リクエスト受け入れ
- PUT `/api/friend-requests/:requestId/reject` - リクエスト拒否

**メッセージ**
- GET `/api/messages/:chatId` - メッセージ履歴取得
- POST `/api/messages` - メッセージ送信（WebSocket でリアルタイム対応）

**チャット**
- GET `/api/chats` - ユーザーのチャット一覧
- POST `/api/chats` - 新しいチャット作成

**推奨**
- GET `/api/recommendations` - 友達推奨を取得

### チームメンバー

- Le Duong Huy
- Tran Quoc Dat
- Tang Ngoc Hau
- Nguyen Tuan Ngoc

### ライセンス

ISC License
