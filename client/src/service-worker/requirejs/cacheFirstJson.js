/* globals define */
import { moduleUrl, getModuleText } from './utils';

// Requirejs plugin for fetching files from cache first.
// Must be loaded after require.js
define('cacheFirstJson', [], _ => {
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
      .then(text => onload.fromText(`define([], () => ${text})`))
      .catch(onload.error);
  }

  // To create a plugin we return this interface.
  return { load };
});
