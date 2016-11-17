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
  const fromNetwork = fetch(request)
    .then(response => {
      return UserCache.save(request, response);
    });

  const fromCache = UserCache.retrieve(request);

  return fromCache
    .then(cached => {
      console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', request.url);
      if (cached) {
        // If we serve from cache, no one will catch errors in the
        // network request. So we decide to catch and ignore them.
        fromNetwork.catch(() => null);
        return cached;
      }

      return fromNetwork;
    });
};
