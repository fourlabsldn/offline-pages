/* globals define */
import { moduleUrl, getModuleText, standardRequire } from './utils';

// Requirejs plugin for fetching files from cache first.
// Must be loaded after require.js
define('cacheFirst', [], _ => {
  /**
   * @method load
   * @param  {String} name - Module name as required.
   * @param  {Object/Function} req - instance of RequireJS
   * @param  {Function} onload - function to be called with the loading outcome
   * @param  {Object} config - RequireJS configuration object
   * @return {void} - This function does not return anything. It must call
   *                     onload or onload.fromText or onload.error
   */
  function load(name, req, onload, config) {
    const url = moduleUrl(name, config);

    getModuleText(url)
      .then(text => onload.fromText(text))
      // If it fails we use the same API as require().
      // It will use importScripts, which doesn't cache the response
      // but at this point it we tried everything we could and it is
      // better to let requireJS deal with any error that may occur.
      .catch(__ => {
        console.log('Using requirejs for', name);
        standardRequire(req, onload, name);
      });
  }

  // To create a plugin we return this interface.
  return { load };
});
