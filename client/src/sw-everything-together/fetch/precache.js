const PRECACHE_NAME = 'general';

/**
 * Caches resources from urls given and returns their contents in a Promise.
 * @method
 * @param  {Array<String>} urls ]
 * @return {Array<Response>}
 */
export default (urls, cacheName = PRECACHE_NAME) => {
  return caches.open(cacheName)
  .then(cache => cache.addAll(urls))
  .then(_ => Promise.all(urls.map(u => caches.match(u))))
  // Clone all responses to make sure they are not consumed by the function caller.
  .then(responses => responses.map(r => r.clone()));
};
