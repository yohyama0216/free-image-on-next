# free-image-material-site

フリー画像素材サイト

## サイトURL

このサイトは GitHub Pages でホスティングされています。

**公開URL**: https://yohyama0216.github.io/free-image-on-next/

### サイトURLの確認方法

1. **GitHub リポジトリから確認**:
   - リポジトリページ（https://github.com/yohyama0216/free-image-on-next）にアクセス
   - 右側のサイドバーの「About」セクションにサイトURLが表示されます
   - または、Settings > Pages からデプロイされたURLを確認できます

2. **GitHub Actions から確認**:
   - リポジトリの「Actions」タブを開く
   - 最新の「Deploy Next.js to GitHub Pages」ワークフローをクリック
   - デプロイジョブの詳細で `github-pages` 環境のURLが表示されます

## ローカル開発

### 前提条件

- Node.js 18.x 以上
- npm

### セットアップ

1. リポジトリをクローン:
```bash
git clone https://github.com/yohyama0216/free-image-on-next.git
cd free-image-on-next
```

2. 依存関係をインストール:
```bash
npm install
```

3. 開発サーバーを起動:
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてサイトを確認できます。

### 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - WebP画像を生成し、HTML詳細ページを生成し、プロダクションビルドを作成
- `npm run build:quick` - WebP生成とHTML生成をスキップして高速ビルド
- `npm start` - プロダクションサーバーを起動
- `npm run lint` - ESLintでコードをチェック
- `npm run generate-webp` - WebP画像を生成
- `npm run generate-html` - assets.jsonから各素材の詳細HTMLページを生成

## デプロイ方法

このプロジェクトは **GitHub Actions** を使用して自動的に GitHub Pages にデプロイされます。

### 自動デプロイ（推奨）

1. **main ブランチにプッシュ**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **GitHub Actions が自動実行**:
   - `.github/workflows/pages.yml` で定義されたワークフローが自動的に実行されます
   - ビルドとデプロイのプロセスは約2〜3分かかります

3. **デプロイ状況の確認**:
   - リポジトリの「Actions」タブでワークフローの実行状況を確認
   - 成功すると、サイトが自動的に更新されます

### 手動デプロイ

GitHub Actions の「Deploy Next.js to GitHub Pages」ワークフローから手動でデプロイすることもできます：

1. リポジトリの「Actions」タブを開く
2. 左側のワークフロー一覧から「Deploy Next.js to GitHub Pages」を選択
3. 「Run workflow」ボタンをクリック
4. ブランチを選択（通常は `main`）
5. 「Run workflow」を実行

### デプロイプロセスの詳細

GitHub Actions ワークフローは以下のステップを実行します：

1. **依存関係のインストール**: `npm ci`
2. **WebP画像の生成**: `npm run generate-webp`
3. **HTML詳細ページの生成**: `npm run generate-html`
   - `assets.json` に定義されたすべての素材に対して、`items/{id}/index.html` 形式でHTMLファイルを生成
   - 各ページには素材の詳細情報、メタデータ、OGPタグ、関連素材が含まれます
4. **Next.jsビルド**: `next build`
   - 静的エクスポート（`output: 'export'`）を使用
   - ビルド成果物は `out` ディレクトリに出力
5. **GitHub Pages へのデプロイ**: `out` ディレクトリの内容をデプロイ

### GitHub Pages の設定

GitHub Pages は以下のように設定されています：

- **Source**: GitHub Actions
- **出力ディレクトリ**: `./out`
- **ベースパス**: `/free-image-on-next/`

設定を確認・変更する場合：
1. リポジトリの Settings > Pages を開く
2. 「Build and deployment」セクションで設定を確認

## トラブルシューティング

### デプロイが失敗する場合

1. **Actions タブでエラーを確認**:
   - エラーメッセージとログを確認
   - ビルドエラーの場合は、ローカルで `npm run build` を実行して問題を特定

2. **キャッシュの問題**:
   - Actions の実行時に "Clear cache" を試す
   - または、`npm ci` が正常に動作することを確認

3. **Node.js のバージョン**:
   - ワークフローでは Node.js 18.x を使用
   - ローカル開発環境も同じバージョンを使用することを推奨

### ページが表示されない場合

1. **URL を確認**:
   - ベースパスが正しいか確認（`/free-image-on-next/`）
   - `next.config.js` の `basePath` と `assetPrefix` が正しく設定されているか確認

2. **デプロイ完了を待つ**:
   - デプロイ完了後、反映まで数分かかる場合があります
   - ブラウザのキャッシュをクリアしてみてください

## 技術スタック

- **フレームワーク**: Next.js 14.0.0
- **UI ライブラリ**: React 18
- **言語**: TypeScript
- **画像最適化**: Sharp (WebP生成)
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions

## 新しい画像素材の追加方法

新しい画像素材をサイトに追加する手順：

1. **画像ファイルを配置**:
   ```bash
   # カテゴリに応じたフォルダに画像を配置
   public/assets/interior/new-image.jpg
   public/assets/pattern/new-pattern.png
   ```

2. **サムネイルを作成**:
   ```bash
   # サムネイル用のフォルダに小さいバージョンを配置
   public/assets/_thumbs/new-image_thumb.jpg
   ```

3. **assets.json に情報を追加**:
   ```json
   {
     "id": "new-image",
     "title": "新しい画像",
     "category": "interior",
     "tags": ["タグ1", "タグ2"],
     "description": "画像の説明",
     "license": "CC0-1.0",
     "originalPath": "assets/interior/new-image.jpg",
     "thumbnailPath": "assets/_thumbs/new-image_thumb.jpg",
     "width": 1920,
     "height": 1080,
     "fileSize": 234567,
     "slug": "new-image",
     "createdAt": "2024-01-01T00:00:00+00:00",
     "updatedAt": "2024-01-01T00:00:00+00:00"
   }
   ```

4. **ビルドを実行**:
   ```bash
   npm run build
   # または個別に実行
   npm run generate-html  # HTML詳細ページを生成
   npm run generate-webp  # WebP画像を生成
   ```

5. **コミットしてプッシュ**:
   ```bash
   git add .
   git commit -m "Add new image: new-image"
   git push
   ```

自動的に以下が生成されます：
- `items/new-image/index.html` - 詳細ページ
- WebP形式の画像ファイル
- サムネイルのWebP版
