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

const fromCache = url =>
  caches.match(url);

const standardRequire = (req, onload, name) =>
  req([name], onload, onload.error);

const moduleUrl = (name, config) => (
  config && config.paths && config.paths[name]
    ? `${config.paths[name]}.js`
    : name
);

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

export default {
  moduleUrl,
  getModuleText,
  standardRequire,
};
