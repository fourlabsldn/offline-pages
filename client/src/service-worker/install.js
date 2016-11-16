/*
  Here we will fetch all the critical resources for
  our website to work offline and cache it.

  We will not do any cache cleanup just yet as at
  this point any previous Service Workers of the page
  are still working on it.
 */

import UserCache from './UserCache';

// If a request to any of these files fails, the worker
// will not be installed, so these paths must be correct and active.
const CRITICAL_FILES = [
  '/offline',
];

export default event => {
  const cacheNames = UserCache.names();

  const cachingCriticalAssets = caches
    .open(cacheNames.permanent)
    .then(cache => cache.addAll(CRITICAL_FILES));

  event.waitUntil(cachingCriticalAssets);
};
