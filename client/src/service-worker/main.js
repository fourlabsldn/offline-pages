/* globals */

import toolbox from 'sw-toolbox';
import htmlFallbackFor from './fetch/html-fallback';
import backgroundSync from './fetch/background-sync';
import contactInfo from './dynamic-pages/contacts';
import notify from './notify';
import routes from './routes';

const dynamicPages = { contactInfo };

// Files that must be available in cache at all times.
// This will usually be the application shell.
toolbox.precache(routes.precache);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
const sendLaterIfOffline = backgroundSync(
  toolbox.networkFirst,
  _ => new Response('{ "waiting": true }')
);

toolbox.router.post(
  /\/api\//,
  sendLaterIfOffline,
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
  htmlFallbackFor(toolbox.fastest, routes.offlineFallback.page),
  {
    // Use a dedicated cache object
    cache: {
      name: 'general',
      //  maxEntries: 10,
      // Expire any entries that are older than one week.
      maxAgeSeconds: 60 * 60 * 24 * 7,
    },
  }
);

/*
  =============================================================================
  Intercept requests to contacts and build the page dynamically
 */
toolbox.router.get('/html/contact-info', dynamicPages.contactInfo);

// =============================================================================
// By default, all requests will request the resource from
// both the cache and the network in parallel. Responding with
// whichever returns first.
toolbox.router.default = toolbox.networkFirst;

// ensure our service worker takes control of the page as soon
// as possible.
self.addEventListener(
  'install',
  event => {
    // notify('Install happened', '');
    event.waitUntil(self.skipWaiting());
  }
);

self.addEventListener(
  'activate',
  event => {
    notify('Activation happened', '');
    event.waitUntil(self.clients.claim());
  }
);
