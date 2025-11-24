const fs = require('fs');
const path = require('path');

// assets.jsonを読み込む
const assetsPath = path.join(__dirname, '../assets.json');
const assetsData = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));

// 出力ディレクトリ
const outputDir = path.join(__dirname, '../items');

// items ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ファイル拡張子を取得する関数
function getFileExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'JPG';
  if (ext === '.png') return 'PNG';
  if (ext === '.webp') return 'WEBP';
  return ext.toUpperCase().substring(1);
}

// HTML テンプレートを生成する関数
function generateDetailHTML(item, relatedItems) {
  const tags = item.tags || [];
  const tagsHTML = tags.map(tag => 
    `<a href="../../list.html?tag=${encodeURIComponent(tag)}" class="badge bg-light text-dark text-decoration-none">${tag}</a>`
  ).join('\n                ');

  const relatedHTML = relatedItems.map(related => `
              <div class="col-lg-4 col-md-6">
                <a href="../${related.id}/" class="text-decoration-none">
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="position-relative">
                      <img src="../../${related.thumbnailPath}" class="card-img-top" style="height: 120px; object-fit: cover;" alt="${related.title}">
                      <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-primary small">${related.category}</span>
                      </div>
                    </div>
                    <div class="card-body p-2">
                      <h6 class="card-title small mb-1 text-dark">${related.title}</h6>
                      <small class="text-muted">${related.category}</small>
                    </div>
                  </div>
                </a>
              </div>`).join('\n              ');

  const descriptionHTML = item.description ? `
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">説明</h6>
              <p class="text-muted">${item.description}</p>
            </div>` : '';

  const fileExt = getFileExtension(item.originalPath);

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${item.title} - やまさんのフリー素材屋</title>
  <meta name="description" content="${item.title} - ${item.category}カテゴリのフリー画像素材。高品質素材を無料でダウンロード。商用利用可能。">
  <meta name="keywords" content="${tags.join(',')},フリー素材,${item.category},無料ダウンロード,商用利用可能">
  <meta name="author" content="やまさん">
  <meta property="og:title" content="${item.title} - やまさんのフリー素材屋">
  <meta property="og:description" content="${item.title} - ${item.category}カテゴリのフリー画像素材。高品質素材を無料でダウンロード。">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/items/${item.id}/">
  <meta property="og:image" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/${item.originalPath}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title} - やまさんのフリー素材屋">
  <meta name="twitter:description" content="${item.title} - ${item.category}カテゴリのフリー画像素材">
  <meta name="twitter:image" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/${item.originalPath}">
  <link rel="canonical" href="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/items/${item.id}/">
  <link rel="icon" href="data:," />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
<!-- ナビゲーション -->
<div id="nav-placeholder"></div>

<!-- メインコンテンツ -->
<main class="py-4">
  <div class="container">
    <!-- パンくずナビ -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="../../index.html" class="text-decoration-none">ホーム</a></li>
        <li class="breadcrumb-item"><a href="../../list.html?cat=${item.category}" class="text-decoration-none">${item.category}</a></li>
        <li class="breadcrumb-item active" aria-current="page">${item.title}</li>
      </ol>
    </nav>

    <div class="row">
      <!-- 画像表示エリア -->
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <img src="../../${item.originalPath}" alt="${item.title}" class="img-fluid rounded mb-3" style="width: 100%; max-height: 500px; object-fit: contain; background-color: #f8f9fa;">
            
            <!-- ダウンロードボタン -->
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <a href="../../${item.originalPath}" download="${path.basename(item.originalPath)}" class="btn btn-primary btn-lg">
                <i class="bi bi-download"></i> 高解像度版をダウンロード
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 詳細情報 -->
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <h1 class="h4 mb-0">${item.title}</h1>
          </div>
          <div class="card-body">
            <!-- 基本情報 -->
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">基本情報</h6>
              <ul class="list-unstyled mb-0">
                <li><strong>カテゴリ:</strong> <span class="badge bg-primary">${item.category}</span></li>
                <li><strong>サイズ:</strong> ${item.width} × ${item.height} px</li>
                <li><strong>ファイル形式:</strong> ${fileExt}</li>
                <li><strong>ライセンス:</strong> <span class="badge bg-success">${item.license}</span></li>
              </ul>
            </div>

            <!-- タグ -->
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">タグ</h6>
              <div class="d-flex flex-wrap gap-1">
                ${tagsHTML}
              </div>
            </div>

            <!-- 利用条件 -->
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">利用条件</h6>
              <ul class="list-unstyled text-success">
                <li>✓ 商用利用可能</li>
                <li>✓ クレジット表記不要</li>
                <li>✓ 加工・改変OK</li>
                <li>✓ 再配布可能</li>
              </ul>
            </div>

            <!-- 説明文 -->
            ${descriptionHTML}
          </div>
        </div>

        <!-- 関連素材 -->
        <div class="card shadow-sm mt-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0"><i class="bi bi-grid-3x3-gap"></i> 関連する素材</h6>
            <small class="text-muted">タグ・カテゴリが類似する素材</small>
          </div>
          <div class="card-body">
            <div class="row g-3">
              ${relatedHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- フッター -->
<footer class="bg-dark text-white py-4 mt-5">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h5>やまさんのフリー素材屋</h5>
        <p class="small mb-0">クリエイター向けのフリー画像素材を提供しています。</p>
      </div>
      <div class="col-md-4">
        <h6>メニュー</h6>
        <ul class="list-unstyled">
          <li><a href="../../external-transmission.html" class="text-light text-decoration-none small">外部送信</a></li>
          <li><a href="../../privacy-policy.html" class="text-light text-decoration-none small">Privacy policy</a></li>
          <li><a href="../../terms.html" class="text-light text-decoration-none small">Terms of Use</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h6>ナビゲーション</h6>
        <ul class="list-unstyled">
          <li><a href="../../index.html" class="text-light text-decoration-none small">ホーム</a></li>
          <li><a href="../../list.html" class="text-light text-decoration-none small">素材一覧</a></li>
          <li><a href="../../tags.html" class="text-light text-decoration-none small">タグ一覧</a></li>
          <li><a href="../../list.html?cat=${item.category}" class="text-light text-decoration-none small">${item.category}一覧</a></li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="text-center">
      <small>&copy; やまさんのフリー素材屋｜無料の背景イラスト. All rights reserved.</small>
    </div>
  </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../../includes/nav.js"></script>
</body>
</html>
`;
}

// 関連する素材を取得する関数
function getRelatedItems(currentItem, allItems, maxCount = 3) {
  const related = allItems.filter(item => {
    if (item.id === currentItem.id) return false;
    
    // 同じカテゴリまたは重複するタグがある場合
    if (item.category === currentItem.category) return true;
    
    const currentTags = currentItem.tags || [];
    const itemTags = item.tags || [];
    const hasCommonTag = currentTags.some(tag => itemTags.includes(tag));
    
    return hasCommonTag;
  });
  
  return related.slice(0, maxCount);
}

// メイン処理
function main() {
  console.log('Starting HTML generation from assets.json...');
  
  const items = assetsData.items;
  
  if (!items || items.length === 0) {
    console.log('No items found in assets.json');
    return;
  }
  
  console.log(`Found ${items.length} items to process`);
  
  items.forEach((item, index) => {
    // アイテムディレクトリを作成
    const itemDir = path.join(outputDir, item.id);
    if (!fs.existsSync(itemDir)) {
      fs.mkdirSync(itemDir, { recursive: true });
    }
    
    // 関連素材を取得
    const relatedItems = getRelatedItems(item, items);
    
    // HTMLを生成
    const html = generateDetailHTML(item, relatedItems);
    
    // index.html として保存
    const outputPath = path.join(itemDir, 'index.html');
    fs.writeFileSync(outputPath, html, 'utf8');
    
    console.log(`Generated: ${outputPath}`);
  });
  
  console.log('HTML generation completed!');
}

// スクリプトが直接実行された場合
if (require.main === module) {
  main();
}

module.exports = { main, generateDetailHTML, getRelatedItems };
