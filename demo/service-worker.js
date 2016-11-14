// We will cache requests for a week.

// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

const CACHE_VERSION = 1;
const CURRENT_CACHES = [
  `v${CACHE_VERSION}-${daysAgo(0)}`,
  `v${CACHE_VERSION}-${daysAgo(1)}`,
  `v${CACHE_VERSION}-${daysAgo(2)}`,
  `v${CACHE_VERSION}-${daysAgo(3)}`,
  `v${CACHE_VERSION}-${daysAgo(4)}`,
  `v${CACHE_VERSION}-${daysAgo(5)}`,
  `v${CACHE_VERSION}-${daysAgo(6)}`,
];


self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.

  const cacheCleaning = window.caches.keys()
    .then(cacheNames => {
      // If this cache name isn't present in the array of "expected" cache names, then delete it.
      const cacheDeletions = cacheNames
        .filter(n => !CURRENT_CACHES.includes(n))
        .map(n => caches.delete(n));

      return Promise.all(cacheDeletions);
    });

  event.waitUntil(cacheCleaning);
});


/**
 * @method getCachedRequest
 * @param  {Request} req
 * @return {Promise<Response>} - Will resolve with a response, if found, or undefined if not.
 */
function getCachedRequest(req) {
  const cachesSearch = CURRENT_CACHES
    .map(cacheName => window.caches.open(cacheName))
    .map(cache => cache.match(req))
    // We are not interested in errors fetching cached resources, so we just ignore them
    .map(matchPromise => matchPromise.catch(() => undefined));

  return Promise.all(cachesSearch)
    .then(results => results.filter(r => r)) // remove undefined values
    .then(results => results[0]); // use newest value
}

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

    getCachedRequest(event.request)
      .then(function(response) {
        if (response) {
          // If there is an entry in the cache for event.request, then response will be defined
          // and we can just return it. Note that in this example, only font resources are cached.
          console.log(' Found response in cache:', response);

          return response;
        }

        // Otherwise, if there is no entry in the cache for event.request, response will be
        // undefined, and we need to fetch() the resource.
        console.log(' No response for %s found in cache. About to fetch ' +
          'from network...', event.request.url);

        // We call .clone() on the request since we might use it in a call to cache.put() later on.
        // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
        // (see https://fetch.spec.whatwg.org/#dom-request-clone)
        return fetch(event.request.clone()).then(function(response) {
          console.log('  Response for %s from network is: %O',
            event.request.url, response);

          if (response.status < 400 &&
              response.headers.has('content-type') &&
              response.headers.get('content-type').match(/^font\//i)) {
            // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
            // We also only want to cache responses that correspond to fonts,
            // i.e. have a Content-Type response header that starts with "font/".
            // Note that for opaque filtered responses (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
            // we can't access to the response headers, so this check will always fail and the font won't be cached.
            // All of the Google Web Fonts are served off of a domain that supports CORS, so that isn't an issue here.
            // It is something to keep in mind if you're attempting to cache other resources from a cross-origin
            // domain that doesn't support CORS, though!
            // We call .clone() on the response to save a copy of it to the cache. By doing so, we get to keep
            // the original response object which we will return back to the controlled page.
            // (see https://fetch.spec.whatwg.org/#dom-response-clone)
            console.log('  Caching the response to', event.request.url);
            cache.put(event.request, response.clone());
          } else {
            console.log('  Not caching the response to', event.request.url);
          }

          // Return the original response object, which will be used to fulfill the resource request.
          return response;
        });
      })
      .catch(function(error) {
        // This catch() will handle exceptions that arise from the match() or fetch() operations.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('  Error in fetch handler:', error);

        throw error;
      });
    })
  event.respondWith();
});
