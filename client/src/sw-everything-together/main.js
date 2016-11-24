/*
================================================================================


  This service worker takes care of caching static files
  and providing a fallback page saying "You seem to be offline".

  It will also download parts of the database to make dynamic page loading
  possible.


================================================================================
*/

import toolbox from 'sw-toolbox';
import htmlFallbackFor from './fetch/html-fallback';
import backgroundSync from './fetch/background-sync';
import precache from './fetch/precache';
import contactInfo from './dynamic-pages/contacts';
import notify from './notify';
import routes from './routes';

const dynamicPages = { contactInfo };

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
  defaultCacheConfig
);

/*
  =============================================================================
  Intercept requests to contacts and build the page dynamically
 */
toolbox.router.get(
  '/html/contact-info/:id',
  dynamicPages.contactInfo
);

/*
  =============================================================================
  Serve our offline page when an html page is not available
  This must come last because is matching all of our domain's url
 */
toolbox.router.get(
  /html/,
  htmlFallbackFor(toolbox.fastest, routes.offlineFallback.page),
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
  Load essential resources when the service-worker is installed.
 */
function loadEssentialResources() {
  return precache(routes.precache, GLOBAL_CACHE)
  .then(cachedResponses => {
    const contactsDataUrlIndex = routes.precache.indexOf(routes.contactsPage.data);
    const contactsResponse = cachedResponses[contactsDataUrlIndex];
    return contactsResponse.json();
  })
  .then(contacts => {
    const contactImages = contacts.map(c => c.image);
    return precache(contactImages, GLOBAL_CACHE);
  });
}

// Ensure our service worker takes control of the page as soon
// as possible.
self.addEventListener(
  'install',
  event => {
    console.log('Pre-caching: ', routes.precache);

    const precaching = loadEssentialResources()
      .then(_ => self.skipWaiting()); // We make the service-worker take charge when finished.

    event.waitUntil(precaching);
  }
);

self.addEventListener(
  'activate',
  event => {
    notify('Activation happened', '');
    event.waitUntil(self.clients.claim());
  }
);
