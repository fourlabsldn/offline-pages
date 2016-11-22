/* globals */

import toolbox from 'sw-toolbox';
import htmlFallbackFor from './fetch/html-fallback';
import backgroundSync from './fetch/background-sync';
import contacts from './dynamic-pages/contacts';

// Define files that must be available in cache at all times.
// This will usually be the application shell.
const OFFLINE_REDIRECTION = '/html/offline';
const CRITICAL_FILES = [
  OFFLINE_REDIRECTION,
  '/static/images/offline.png',
];

toolbox.precache(CRITICAL_FILES);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
const newMessageHandler = backgroundSync(
  toolbox.networkFirst,
  _ => new Response('{ "waiting": true }')
);

toolbox.router.post(
  /\/api\//,
  newMessageHandler,
  {
    // Use a dedicated cache object
    cache: {
      name: 'api',
      networkTimeoutSeconds: 1,
      //  maxEntries: 10,
      // Expire any entries that are older than one week seconds.
      maxAgeSeconds: 60 * 60 * 24 * 7,
    },
  }
);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
toolbox.router.get(
  /html/,
  htmlFallbackFor(toolbox.fastest, OFFLINE_REDIRECTION),
  {
    // Use a dedicated cache object
    cache: {
      name: 'general',
      //  maxEntries: 10,
      // Expire any entries that are older than one week seconds.
      maxAgeSeconds: 60 * 60 * 24 * 7,
    },
  }
);

/*
  =============================================================================
  Intercept requests to contacts
 */
toolbox.router.get(':test/contacts', contacts);

// =============================================================================
// By default, all requests will request the resource from
// both the cache and the network in parallel. Responding with
// whichever returns first.
toolbox.router.default = toolbox.networkFirst;

// ensure our service worker takes control of the page as soon
// as possible.
self.addEventListener(
  'install',
  event => event.waitUntil(self.skipWaiting())
);

self.addEventListener(
  'activate',
  event => event.waitUntil(self.clients.claim())
);
