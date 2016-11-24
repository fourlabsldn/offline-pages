/*
================================================================================


  This service worker takes care of caching static files
  and providing a fallback page saying "You seem to be offline".
  Just that.

  It allows people, when offline, to browse through previously visited pages.


================================================================================
*/

import toolbox from 'sw-toolbox';
import htmlFallbackFor from './html-fallback';

const offlineFallback = '/html/offline';
const GLOBAL_CACHE = 'general';
const defaultCacheConfig = {
  // Use a dedicated cache object
  cache: {
    name: GLOBAL_CACHE,
    networkTimeoutSeconds: 1,
    //  maxEntries: 10,
    // Expire any entries that are older than one week seconds.
    maxAgeSeconds: 60 * 60 * 24 * 7,
  },
};

/*
  =============================================================================
  Make sure we have the offline page cached from the start
*/
toolbox.precache([offlineFallback]);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
toolbox.router.get(
  /html/,
  htmlFallbackFor(toolbox.fastest, offlineFallback),
  defaultCacheConfig
);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
toolbox.router.get(
  /static/,
  toolbox.fastest,
  defaultCacheConfig
);

/*
  =============================================================================
  By default, all requests will request the resource from
  both the cache and the network in parallel. Responding with
  whichever returns first.
 */
toolbox.router.default = toolbox.networkFirst;

/*
  =============================================================================
  Ensure our service worker takes control of the page as soon as possible.
 */
self.addEventListener(
  'install',
  event => event.waitUntil(self.skipWaiting())
);

self.addEventListener(
  'activate',
  event => event.waitUntil(self.clients.claim())
);
