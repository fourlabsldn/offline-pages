const PRECACHE_NAME = 'precache';

export default (...filesToCache) => {
  return caches.open(PRECACHE_NAME)
    .then(cache => cache.addAll(filesToCache));
};
