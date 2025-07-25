const CACHE_NAME = 'geolocation-app-cache-v1';
const urlsToCache = [
  '/index.html', // Gsystemtop.html から index.html に変更
  '/Gsystemmain.html',
  '/manifest.json',
  // 必要に応じて、CSSや画像ファイルなどもここに追加
  '/Gsystemトップ画像.jpg', // 画像ファイルもキャッシュ対象に追加
  // 例: '/css/style.css'
];

// サービスワーカーのインストール（キャッシュの追加）
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースのフェッチ（キャッシュからの取得またはネットワークからの取得）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにリソースがあればそれを使用
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      })
  );
});

// 古いキャッシュの削除（新しいサービスワーカーがアクティブになった時）
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ホワイトリストにない古いキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
