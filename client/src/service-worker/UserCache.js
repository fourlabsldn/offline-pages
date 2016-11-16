/*
  Here we specify the cache names we are using
 */

const UserCache = {};

// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

// When we change our cache version all caches of previous versions are deleted
const CACHE_VERSION = 1;
const PERMANENT_CACHE = `v${CACHE_VERSION}-permanent`;

/**
 * Returns an object with the names of the caches that are currently in use.
 * @method names
 * @return {[type]} [description]
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

export default UserCache;
