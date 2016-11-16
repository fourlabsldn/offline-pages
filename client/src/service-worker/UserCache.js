/*
  Here we specify the cache names we are using
 */
import { filter, includes, map, curry } from 'lodash/fp';

// When we change our cache version all caches of previous versions are deleted
const CACHE_VERSION = 1;
const PERMANENT_CACHE = `v${CACHE_VERSION}-permanent`;

const UserCache = {};

// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

/**
 * Returns an object with the names of the caches that are currently in use.
 * @method names
 * @return {Object}
 */
UserCache.names = () => {
  // We have a cache for each day of the week.
  // We will erase cached files older than this.
  const temporaryCache = [
    `v${CACHE_VERSION}-${daysAgo(0)}`,
    `v${CACHE_VERSION}-${daysAgo(1)}`,
    `v${CACHE_VERSION}-${daysAgo(2)}`,
    `v${CACHE_VERSION}-${daysAgo(3)}`,
    `v${CACHE_VERSION}-${daysAgo(4)}`,
    `v${CACHE_VERSION}-${daysAgo(5)}`,
    `v${CACHE_VERSION}-${daysAgo(6)}`,
  ];

  return {
    all: temporaryCache.concat([PERMANENT_CACHE]),
    permanent: PERMANENT_CACHE,
    temporary: temporaryCache,
    newest: temporaryCache[0],
    oldest: temporaryCache.slice(-1)[0], // last element
  };
};

/**
 * Delete all caches that are too old.
 * @method cleanup
 * @return {Promise<void>}
 */
UserCache.cleanup = () => {
  const cacheNames = UserCache.names();

  // Remove all caches whose name is not in cacheNames.all
  return caches
    .keys()
    .then(filter(cName => includes(cName, cacheNames.all)))
    .then(map(cName => caches.delete(cName)));
};

/**
 * Saves a network response in the cache, making sure to erase any
 * previous versions of it.
 * @method save
 * @param  {Request} request
 * @param  {Response} response
 * @return {Promise<void>}
 */
UserCache.save = curry((request, response) => {
  // Delete cache containing this request.
  caches
    .keys()
    .then(map(n => caches.open(n)))
    .then(cachePromises => Promise.all(cachePromises))
    .then(cs => {
      cs.forEach(cache => {
        cache
          .match(request)
          .then(resp => resp || cache.delete(request));
      });
    });

  // Cache network response
  const responseClone = response.clone();
  return caches
    .open(UserCache.names().newest)
    .then(cache => cache.put(request, responseClone));
});

export default UserCache;
