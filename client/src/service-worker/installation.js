/*
  Here we will fetch all the critical resources for
  our website to work offline and cache it.

 */

import cacheNames from './cacheNames';

export default serviceWorker => {
  serviceWorker.addEventListener('install', event => {
    console.log(self);
    console.log('Installing');

    const cachingCriticalAssets = caches
      .open(cacheNames.permanent)
      .then(cache => cache.addAll(['/offline']));

    event.waitUntil(cachingCriticalAssets);
  });
};
