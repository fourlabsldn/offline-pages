/* globals define */
const REQUIREJS_MODULES_CACHE = 'requirejs-modules-cache';

/**
 * Get the content of the url from cache if possible, if not, from network.
 * @method getModuleText
 * @param  {String} moduleURL
 * @return {Promise<String>} Module text content
 */
function getModuleText(moduleURL) {
  return caches.match(moduleURL)
    .then(cachedModuleResponse => {
      if (cachedModuleResponse !== undefined) {
        console.log('Executing from cache: ', moduleURL);
        return cachedModuleResponse;
      }

      return fetch(moduleURL, { mode: 'no-cors' })
        .then(response => {
          console.log('Saving to cache: ', moduleURL);

          caches.open(REQUIREJS_MODULES_CACHE)
          .then(requirejsCache => requirejsCache.put(moduleURL, response.clone()));

          return response.clone();
        });
    })
    .then(response => response.text());
}

// Requirejs plugin for fetching files from cache first.
// Must be loaded after require.js
define('cacheFirst', [], _ => {
  function load(name, req, onload, config) {
    const moduleUrl = config.paths && config.paths[name]
      ? `${config.paths[name]}.js`
      : name;

    // We use a try because the URL fetching may fail, or the cache fetching may fail
    return getModuleText(moduleUrl)
      .then(moduleText => onload.fromText(moduleText))
      // If it fails we use the same API as require().
      .catch(__ => req([name], value => onload(value)));
  }

  return { load };
});
