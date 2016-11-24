import toolbox from 'sw-toolbox';
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
