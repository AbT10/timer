var cacheName = 'chess_clock_v2';
var filesToCache = [
'style.css',
'scr.js',
'index.html',  
];

self.addEventListener('install', function(e) {
  console.log('Installing Service worker');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('Activated');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('Fetching', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
});

self.addEventListener('beforeinstallprompt', e=>{
  console.log("Add to homescreen prompt fired");
  // e.preventDefault();
  // let eve = e;
  e.userChoice.then(action=>{
    console.log(action.outcome);
  })
})