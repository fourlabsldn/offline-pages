// We will cache requests for a week.

// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

// When we change our cache version all caches of previous versions are deleted
const CACHE_VERSION = 1;

// We have a cache for each day of the week, and we erase it if it is
// more than 7 days old
const CURRENT_CACHES = [
  `v${CACHE_VERSION}-${daysAgo(0)}`,
  `v${CACHE_VERSION}-${daysAgo(1)}`,
  `v${CACHE_VERSION}-${daysAgo(2)}`,
  `v${CACHE_VERSION}-${daysAgo(3)}`,
  `v${CACHE_VERSION}-${daysAgo(4)}`,
  `v${CACHE_VERSION}-${daysAgo(5)}`,
  `v${CACHE_VERSION}-${daysAgo(6)}`,
];

// =============================================================================
//        SERVICE WORKER ACTIVATION
// =============================================================================

// Delete all caches that aren't named in CURRENT_CACHES.
self.addEventListener('activate', event => {
  const cacheCleaning = window.caches.keys()
    .then(cacheNames => cacheNames
        .filter(n => !CURRENT_CACHES.includes(n))
        .map(n => caches.delete(n))
      )
    .then(deletions => Promise.all(deletions));

  event.waitUntil(cacheCleaning);
});


// =============================================================================
//        INTERCEPTING REQUESTS
// =============================================================================

/**
 * Save network response in cache and return the same response
 * @method fetchedFromNetwork
 * @param  {Request} request
 * @param  {Response} response
 * @return {Response}
 */
function fetchedFromNetwork(request, response) {
  console.log('WORKER: fetch response from network.', event.request.url);

  const cacheCopy = response.clone();
  const mostRecentCache = CURRENT_CACHES[0];

  // Cache network response
  // At the moment we are caching everything, but in practice we
  // should cache selectively because our cache has a space limit.
  caches
    .open(mostRecentCache)
    .then(cache => cache.put(request, cacheCopy))
    .then(() => console.log('WORKER: fetch response stored in cache.', event.request.url));

  // Return the response so that the promise is settled in fulfillment.
  return response;
}

// Listen to page requests
self.addEventListener('fetch', event => {
  console.log('Handling fetch event for', event.request.url);

  // We should only cache GET requests.
  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  const responseRetrieval = caches
    .match(event.request)
    .then(cached => {
      const networked = fetch(event.request)
        // We handle the network request with success and failure scenarios.
        .then(response => fetchedFromNetwork(event.request, response));
        // We coule decide to catch requests that fail for both the cache and the
        // network in here, but at the moment we won't do it.

      console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
      return cached || networked;
    });

  event.respondWith(responseRetrieval);
});
