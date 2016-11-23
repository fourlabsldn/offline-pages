/* globals define */
import { curry } from 'lodash/fp';

const REQUIREJS_MODULES_CACHE = 'requirejs-modules-cache';

const saveToCache = curry((cacheName, response) => {
  const url = response.url;
  if (!(200 <= response.status && response.status < 400)) { // eslint-disable-line yoda
    console.log(`Error fetching ${url}`);
    throw new Error(`Failed to fetch ${url}`);
  }

  console.log('Saving to cache: ', url);
  caches.open(cacheName)
    .then(requirejsCache => requirejsCache.put(url, response.clone()));
  return response.clone();
});

const fromNetwork = fetch;

const fromCache = url => caches.match(url);

/**
 * Get the content of the url from cache if possible, if not, from network.
 * @method getModuleText
 * @param  {String} url
 * @return {Promise<String>} Module text content
 */
function getModuleText(url) {
  return fromCache(url)
    .then(cachedResponse => {
      if (cachedResponse !== undefined) {
        console.log('Executing from cache: ', url);
        return cachedResponse;
      }

      return fromNetwork(url)
        .then(saveToCache(REQUIREJS_MODULES_CACHE));
    })
    .then(response => response.text());
}

// Requirejs plugin for fetching files from cache first.
// Must be loaded after require.js
define('cacheFirst', [], _ => {
  function load(name, req, onload, config) {
    const url = config.paths && config.paths[name]
      ? `${config.paths[name]}.js`
      : name;

    console.log('Module url:', url);

    // We use a try because the URL fetching may fail, or the cache fetching may fail
    return getModuleText(url)
      .then(text => onload.fromText(text))
      // If it fails we use the same API as require().
      .catch(__ => {
        console.log('Using requirejs for', url);

        req([name], onload, onload.error);
      });
  }

  return { load };
});
