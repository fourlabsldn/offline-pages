import { curry } from 'lodash/fp';
import cacheNames from './names';

/**
 * Saves a network response in the cache, making sure to erase any
 * previous versions of it.
 *
 * Throws an exception if there is an error saving.
 *
 * @method save
 * @param  {Request} request
 * @param  {Response} response
 * @return {Promise<Response>}
 */
export default curry((request, response) => {
  // // Delete cache containing this request.
  // caches
  //   .keys()
  //   .then(map(n => caches.open(n)))
  //   .then(cachePromises => Promise.all(cachePromises))
  //   .then(cs => {
  //     cs.forEach(cache => {
  //       cache
  //         .match(request)
  //         .then(resp => resp || cache.delete(request));
  //     });
  //   });

  // Cache network response
  const responseClone = response.clone();

  return caches
    .open(cacheNames.newest)
    .then(cache => {
      return cache.put(request, responseClone);
    })
    .then(() => response)
    .catch(err => {
      console.log('Failed to save cache for', response.url, 'with error', err);
      throw err;
    });
});
