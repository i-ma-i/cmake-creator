# CMake Creator

![CMake Creator](https://img.shields.io/badge/CMake-Creator-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-green)

CMake CreatorはブラウザベースのCMakeLists.txt生成ツールです。視覚的なインターフェースを使用してプロジェクト構造を設計し、フォーム入力でCMake設定を行い、完全なプロジェクトをZIPファイルとしてダウンロードできます。

## ✨ 特徴

- 🎯 **視覚的なプロジェクト設計**: 直感的なインターフェースでフォルダ構造を構築
- 📝 **フォームベース入力**: 直感的なフォームでCMake設定を入力
- 👁️ **リアルタイムプレビュー**: 生成されるCMakeLists.txtをその場で確認
- 📦 **ZIPダウンロード**: 完全なプロジェクト構造をZIPで取得
- 💾 **自動保存**: ブラウザのローカルストレージで作業内容を永続化
- 🎨 **モダンUI**: Tailwind CSS + shadcn/uiによる美しいインターフェース
- 🚀 **高速**: Vite + React 18による高速な開発体験

## 🔧 技術スタック

| レイヤー | ライブラリ/ツール | 用途 |
|----------|-------------------|------|
| フレームワーク | React 18 + TypeScript | SPA構築 |
| ビルドツール | Vite | 高速ビルド・HMR |
| UI | Tailwind CSS + shadcn/ui | スタイリング・コンポーネント |
| フォーム | React Hook Form + Zod | フォーム管理・バリデーション |
| テンプレート | Handlebars.js | CMakeLists.txt生成 |
| ファイル操作 | JSZip + FileSaver.js | ZIP生成・ダウンロード |
| テスト | Vitest + Testing Library | ユニットテスト |
| CI/CD | GitHub Actions | 自動テスト・デプロイ |

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/cmake-creator.git
cd cmake-creator

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 🧪 テスト

```bash
# テストの実行
npm run test

# ウォッチモードでテスト実行
npm run test:watch

# カバレッジ付きテスト実行
npm run test:coverage

# テストUIを起動
npm run test:ui
```

### テストカバレッジ

- **テンプレート生成**: Handlebarsテンプレートの正確性
- **パスユーティリティ**: ファイルパス計算ロジック
- **スキーマバリデーション**: Zodによる入力検証
- **ローカルストレージ**: データ永続化機能
- **ZIP生成**: プロジェクトパッケージング

## 🛠️ 開発

### コード品質

```bash
# ESLintによるコードチェック
npm run lint

# Prettierによるコード整形
npm run format
```

### プロジェクト構造

```
cmake-creator/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   ├── FolderTree.tsx  # ファイルツリーコンポーネント
│   │   ├── CMakeForm.tsx   # CMakeフォームコンポーネント
│   │   └── PreviewModal.tsx # プレビューモーダル
│   ├── hooks/              # カスタムフック
│   │   ├── useLocalStorage.ts
│   │   ├── useProjectPersistence.ts
│   │   └── useZipBuilder.ts
│   ├── schemas/            # Zodバリデーションスキーマ
│   ├── templates/          # Handlebarsテンプレート
│   ├── types/              # TypeScript型定義
│   └── utils/              # ユーティリティ関数
├── tests/                  # テストファイル
│   ├── setup.ts           # テスト設定
│   ├── template.test.ts   # テンプレート生成テスト
│   ├── path.test.ts       # パスユーティリティテスト
│   ├── schemas.test.ts    # スキーマバリデーションテスト
│   ├── localStorage.test.ts # ローカルストレージテスト
│   └── useZipBuilder.test.ts # ZIP生成テスト
├── .github/workflows/      # GitHub Actionsワークフロー
└── public/                 # 静的ファイル
```

## 📚 使用方法

### 1. プロジェクト構造の作成

1. 左パネルのプロジェクトツリーでフォルダ構造を設計
2. フォルダにマウスホバーで表示される「+」ボタンでCMakeLists.txtを追加
3. ツリーUIでファイル・フォルダを整理

### 2. CMake設定の入力

1. CMakeLists.txtファイルを選択
2. 右パネルでCMake設定を入力：
   - CMakeバージョン
   - プロジェクト名
   - 対応言語（C/C++/CUDA）
   - ターゲット設定（実行ファイル・ライブラリ）
   - コンパイルオプション

### 3. プレビューと生成

1. 「プレビュー」ボタンで生成されるCMakeLists.txtを確認
2. 「ZIPダウンロード」ボタンで完全なプロジェクトをダウンロード

### 4. データの永続化

- 作業内容は自動的にブラウザに保存されます
- ページを再読み込みしても作業を継続できます
- 「リセット」ボタンで新しいプロジェクトを開始

## 🌐 デプロイ

このアプリケーションはGitHub Pagesでホストされています：

[https://your-username.github.io/cmake-creator](https://your-username.github.io/cmake-creator)

### 自動デプロイ

- `main`ブランチへのプッシュで自動的にGitHub Pagesにデプロイ
- CI/CDパイプラインでテスト・ビルド・デプロイを自動実行

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順でお願いします：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- TypeScriptによる型安全な開発
- ESLint + Prettierによるコード品質管理
- Vitestによるテスト駆動開発
- コンポーネントの単一責任原則
- アクセシビリティの考慮（WCAG AA準拠）

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 🙏 謝辞

- [React](https://reactjs.org/) - UIライブラリ
- [Vite](https://vitejs.dev/) - ビルドツール
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
- [Handlebars](https://handlebarsjs.com/) - テンプレートエンジン

## 📞 サポート

問題や質問がある場合は、[GitHub Issues](https://github.com/your-username/cmake-creator/issues)でお知らせください。