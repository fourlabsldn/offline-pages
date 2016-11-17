/*
  This function will be called every time there is a request
  to the website address. EVERY request to the website
  will call this function, whether the page is open or not.

  This means we must be sure not to do too much here and also
  keep in mind that if something goes wrong here, the whole
  website is affected.
 */

import UserCache from '../UserCache';
import cacheThenNetwork from './cacheThenNetwork';
import { curry } from 'lodash/fp';

/*
  Here we have a neat non-standard trick.
  We want to make periodic cache cleanup, but Service Workers don't give
  us any tool to do such thing. However, we do know that the SW context is
  destroyed when the browser is closed and recreated when it is opened again.

  Taking advantage of that, we use a global variable to determine whether
  the cleanup was done or not.

  This way we can make sure we do a cleanup on every browser restart, which
  should be good enough.
 */
let cleanupDone = false;

/**
 * This function takes care of serving the appropriate content, be
 * that from the network or from the cache.
 *
 * @method fetchIntercept
 * @param  {Request} request
 * @return {Promise<Response> | null}
 */
function fetchIntercept(request) {
  if (!cleanupDone) {
    UserCache.cleanup();
    cleanupDone = true;
  }

  if (request.method === 'GET') {
    return cacheThenNetwork(request);
  }

  // Just do the normal request and let the browser take care of caching.
  return null;
}

const offlineFallback = curry((request, err) => {
  console.log('catching', request.url);
  const accept = request.headers.get('accept') || '';

  if (accept.indexOf('text/html') > -1) {
    return caches
      .match('/offline')
      .then(cached => {
        if (cached) {
          return cached;
        }

        throw err;
      });
  }

  throw err;
});

export default event => {
  const response = fetchIntercept(event.request);

  if (response) {
    event.respondWith(
      response.catch(offlineFallback(event.request))
    );
  }
};
