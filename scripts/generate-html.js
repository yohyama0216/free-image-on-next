const fs = require('fs');
const path = require('path');

// HTML エスケープ関数
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// assets.jsonを読み込む
function loadAssetsData() {
  const assetsPath = path.join(__dirname, '../assets.json');
  try {
    if (!fs.existsSync(assetsPath)) {
      throw new Error(`assets.json not found at ${assetsPath}`);
    }
    const fileContent = fs.readFileSync(assetsPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in assets.json: ${error.message}`);
    }
    throw error;
  }
}

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
    `<a href="../../list.html?tag=${encodeURIComponent(tag)}" class="badge bg-light text-dark text-decoration-none">${escapeHtml(tag)}</a>`
  ).join('\n                ');

  const relatedHTML = relatedItems.map(related => `
              <div class="col-lg-4 col-md-6">
                <a href="../${escapeHtml(related.id)}/" class="text-decoration-none">
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="position-relative">
                      <img src="../../${escapeHtml(related.thumbnailPath)}" class="card-img-top" style="height: 120px; object-fit: cover;" alt="${escapeHtml(related.title)}">
                      <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-primary small">${escapeHtml(related.category)}</span>
                      </div>
                    </div>
                    <div class="card-body p-2">
                      <h6 class="card-title small mb-1 text-dark">${escapeHtml(related.title)}</h6>
                      <small class="text-muted">${escapeHtml(related.category)}</small>
                    </div>
                  </div>
                </a>
              </div>`).join('\n              ');

  const descriptionHTML = item.description ? `
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">説明</h6>
              <p class="text-muted">${escapeHtml(item.description)}</p>
            </div>` : '';

  const fileExt = getFileExtension(item.originalPath);
  
  // メタタグ用のエスケープされたテキスト
  const escapedTitle = escapeHtml(item.title);
  const escapedCategory = escapeHtml(item.category);
  const escapedTags = tags.map(t => escapeHtml(t)).join(',');
  const escapedId = escapeHtml(item.id);
  const escapedOriginalPath = escapeHtml(item.originalPath);

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapedTitle} - やまさんのフリー素材屋</title>
  <meta name="description" content="${escapedTitle} - ${escapedCategory}カテゴリのフリー画像素材。高品質素材を無料でダウンロード。商用利用可能。">
  <meta name="keywords" content="${escapedTags},フリー素材,${escapedCategory},無料ダウンロード,商用利用可能">
  <meta name="author" content="やまさん">
  <meta property="og:title" content="${escapedTitle} - やまさんのフリー素材屋">
  <meta property="og:description" content="${escapedTitle} - ${escapedCategory}カテゴリのフリー画像素材。高品質素材を無料でダウンロード。">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/items/${escapedId}/">
  <meta property="og:image" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/${escapedOriginalPath}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapedTitle} - やまさんのフリー素材屋">
  <meta name="twitter:description" content="${escapedTitle} - ${escapedCategory}カテゴリのフリー画像素材">
  <meta name="twitter:image" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/${escapedOriginalPath}">
  <link rel="canonical" content="https://yohyama0216.github.io/yohyama0216.github.io-free-image-material-/items/${escapedId}/">
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
        <li class="breadcrumb-item"><a href="../../list.html?cat=${escapedCategory}" class="text-decoration-none">${escapedCategory}</a></li>
        <li class="breadcrumb-item active" aria-current="page">${escapedTitle}</li>
      </ol>
    </nav>

    <div class="row">
      <!-- 画像表示エリア -->
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <img src="../../${escapedOriginalPath}" alt="${escapedTitle}" class="img-fluid rounded mb-3" style="width: 100%; max-height: 500px; object-fit: contain; background-color: #f8f9fa;">
            
            <!-- ダウンロードボタン -->
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <a href="../../${escapedOriginalPath}" download="${escapeHtml(path.basename(item.originalPath))}" class="btn btn-primary btn-lg">
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
            <h1 class="h4 mb-0">${escapedTitle}</h1>
          </div>
          <div class="card-body">
            <!-- 基本情報 -->
            <div class="mb-3">
              <h6 class="fw-semibold text-muted">基本情報</h6>
              <ul class="list-unstyled mb-0">
                <li><strong>カテゴリ:</strong> <span class="badge bg-primary">${escapedCategory}</span></li>
                <li><strong>サイズ:</strong> ${escapeHtml(String(item.width))} × ${escapeHtml(String(item.height))} px</li>
                <li><strong>ファイル形式:</strong> ${escapeHtml(fileExt)}</li>
                <li><strong>ライセンス:</strong> <span class="badge bg-success">${escapeHtml(item.license)}</span></li>
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
          <li><a href="../../list.html?cat=${escapedCategory}" class="text-light text-decoration-none small">${escapedCategory}一覧</a></li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="text-center">
      <small>&copy; やまさんのフリー素材屋｜無料の背景イラスト. All rights reserved.</small>
    </div>
  </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
<script src="../../includes/nav.js"></script>
</body>
</html>
`;
}

// 関連する素材を取得する関数 (O(n)に最適化)
function getRelatedItems(currentItem, allItems, maxCount = 3) {
  const related = [];
  const currentTags = currentItem.tags || [];
  
  for (const item of allItems) {
    if (item.id === currentItem.id) continue;
    
    // 同じカテゴリまたは重複するタグがある場合
    if (item.category === currentItem.category) {
      related.push(item);
      if (related.length >= maxCount) break;
      continue;
    }
    
    const itemTags = item.tags || [];
    const hasCommonTag = currentTags.some(tag => itemTags.includes(tag));
    if (hasCommonTag) {
      related.push(item);
      if (related.length >= maxCount) break;
    }
  }
  
  return related;
}

// メイン処理
function main() {
  console.log('Starting HTML generation from assets.json...');
  
  let assetsData;
  try {
    assetsData = loadAssetsData();
  } catch (error) {
    console.error('Failed to load assets.json:', error.message);
    process.exit(1);
  }
  
  const items = assetsData.items;
  
  if (!items || items.length === 0) {
    console.log('No items found in assets.json');
    return;
  }
  
  // 公開フラグでフィルタリング（published が true または未定義の場合は生成）
  const publishedItems = items.filter(item => item.published !== false);
  const skippedCount = items.length - publishedItems.length;
  
  console.log(`Found ${items.length} items (${publishedItems.length} published, ${skippedCount} skipped)`);
  
  publishedItems.forEach((item, index) => {
    try {
      // アイテムディレクトリを作成
      const itemDir = path.join(outputDir, item.id);
      if (!fs.existsSync(itemDir)) {
        fs.mkdirSync(itemDir, { recursive: true });
      }
      
      // 関連素材を取得（公開済みのものだけ）
      const relatedItems = getRelatedItems(item, publishedItems);
      
      // HTMLを生成
      const html = generateDetailHTML(item, relatedItems);
      
      // index.html として保存
      const outputPath = path.join(itemDir, 'index.html');
      fs.writeFileSync(outputPath, html, 'utf8');
      
      console.log(`Generated: ${outputPath}`);
    } catch (error) {
      console.error(`Failed to generate HTML for item ${item.id}:`, error.message);
    }
  });
  
  console.log('HTML generation completed!');
}

// スクリプトが直接実行された場合
if (require.main === module) {
  main();
}

module.exports = { main, generateDetailHTML, getRelatedItems };
