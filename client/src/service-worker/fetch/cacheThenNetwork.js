/*
  Return a value from the cache, if it exists and
  cache the result from the network
 */

import UserCache from '../UserCache';

/**
 * @method cacheThenNetwork
 * @param  {Request} event
 * @return {Promise<Response>}
 */
export default request => {
  return caches
    .match(request)
    .catch(() => undefined) // Catch cache match error
    .then(cached => {
      const networked = fetch(request)
        .then(response => {
          // Save in the cache asynchronously and return immediately
          UserCache.save(request, response);
          return response;
        });
        // We coule decide to catch requests that fail for both the cache and the
        // network in here, but at the moment we won't do it.

      console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', request.url);
      return cached || networked;
    });
};
