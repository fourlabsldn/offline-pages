/* globals */

import toolbox from 'sw-toolbox';

// Define files that must be available in cache at all times.
// This will usually be the application shell.
const CRITICAL_FILES = [
  '/offline',
];

toolbox.precache(CRITICAL_FILES);


toolbox.router.get(/.*/, toolbox.fastest, {
  // Use a dedicated cache object
  cache: {
    name: 'general',
    //  maxEntries: 10,
    // Expire any entries that are older than one week seconds.
    maxAgeSeconds: 60 * 60 * 24 * 7,
  },
});


// By default, all requests that don't match our custom handler will use the
// toolbox.networkFirst cache strategy, and their responses will be stored in
// the default cache.
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
