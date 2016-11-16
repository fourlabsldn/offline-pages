/*
  Here we will fetch all the critical resources for
  our website to work offline and cache it.

 */

import cacheNames from './cacheNames';

// If a request to any of these files fails, the worker
// will not be installed, so these paths must be correct and active.
const CRITICAL_FILES = [
  '/offline',
];

export default serviceWorker => {
  serviceWorker.addEventListener('install', event => {
    const cachingCriticalAssets = caches
      .open(cacheNames.permanent)
      .then(cache => cache.addAll(CRITICAL_FILES));

    event.waitUntil(cachingCriticalAssets);
  });
};
