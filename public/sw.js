var version = '4';
console.log('[sw] running! v' + version);

function cacheAction () {
  // 'caches' available in global scope in Service Worker
  return caches.open('static-v' + version).then(function (cache) {
    console.log('[sw] precaching app shell');
    cache.addAll([
      '/',
      '/src/js',
      '/index.html',
      '/offline.html',
      '/src/js/app.js',
      '/src/js/feed.js',
      '/src/js/material.min.js',
      '/src/css/app.css',
      '/src/css/feed.css',
      '/src/images/main-image.jpg',
    ]);
  }).then(function () {
    console.log('[sw] all resources are cached');
  })
}

self.addEventListener('install', function (ev) {
  console.log('[sw] install!', ev);
	ev.waitUntil(cacheAction());
});

function cleanCache() {
  return caches.keys()
  	.then(function (keyList) {
    	return Promise.all(keyList.map(function (key) {
        if (key !== 'static-v' + version && key !== 'dynamic') {
          console.log('[sw] removing old cache', key);
          return caches.delete(key);
        }
      }));
  });
}



self.addEventListener('activate', function(ev) {
  console.log('[sw] activated',ev);
  ev.waitUntil(cleanCache());
  return self.clients.claim(); // let the sw know that the event is finished successfully.
  // otherwise, it'll show strange errors and bugs
});

// fetch event only reacts with the files under the scope hierarchy
// SPA might need different approach
self.addEventListener('fetch', function(ev) {
  console.log('[sw] fetched!', ev);

  function matchCache (req) {
    return caches.match(req)
      .then(function (cached) {
        if (cached) {
          console.log('cached', cached);
          return cached; // if the response matches with existing cache, get it from cache
        } else {
          console.log('no cache', req);
          return fetch(req)
            .then(function(res) {
              console.log('added to dynamic', req.url);
              caches.open('dynamic')
                .then(function(cache) {
                  cache.put(req.url, res);
                  return res;
                });
            }).catch(function (err) {
              // TODO: currently not working
              console.log('could not access the network for the page');
              caches.open('static-v' + version)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      // else fetch(ev.request);
      }).catch(function (err) {
      console.log(err);
    });
  }

  ev.respondWith(matchCache(ev.request)); // this should happen asap. it'll wait for the promise anyway
  // ev.respondWith(null); // blocks all data
  // ev.respondWith(fetch(ev.request)); // override the received data, returns to browser

});