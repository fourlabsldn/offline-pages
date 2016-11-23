/* globals */

import toolbox from 'sw-toolbox';
import htmlFallbackFor from './fetch/html-fallback';
import backgroundSync from './fetch/background-sync';
import contactInfo from './dynamic-pages/contacts';
import notify from './notify';

const dynamicPages = { contactInfo };

// Define files that must be available in cache at all times.
// This will usually be the application shell.
const OFFLINE_REDIRECTION = '/html/offline';
const CRITICAL_FILES = [
  OFFLINE_REDIRECTION,
  '/static/images/offline.png',

  // Dynamic template generation files
  'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars.js',
  'http://localhost:3000/api/precompiled/layouts.main',
  'http://localhost:3000/api/template-helpers/helpers-transpiled.js',
  'http://localhost:3000/api/precompiled/contact-info',
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
