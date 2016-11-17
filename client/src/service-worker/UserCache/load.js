import cacheNames from './names';

/**
 * Loads URL contents into the permanent cache
 *
 * @method
 * @param  {Array<String>} urls
 * @return {Promise<void>}
 */
export default urls => {
  return caches
    .open(cacheNames.permanent)
    .then(cache => cache.addAll(urls));
};
