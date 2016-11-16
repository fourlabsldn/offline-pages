/*
  Here we specify the cache names we are using
 */

// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

// When we change our cache version all caches of previous versions are deleted
const CACHE_VERSION = 1;

// We have a cache for each day of the week.
// We will erase cached files older than this.
const TEMPORARY_CACHE = [
  `v${CACHE_VERSION}-${daysAgo(0)}`,
  `v${CACHE_VERSION}-${daysAgo(1)}`,
  `v${CACHE_VERSION}-${daysAgo(2)}`,
  `v${CACHE_VERSION}-${daysAgo(3)}`,
  `v${CACHE_VERSION}-${daysAgo(4)}`,
  `v${CACHE_VERSION}-${daysAgo(5)}`,
  `v${CACHE_VERSION}-${daysAgo(6)}`,
];

const PERMANENT_CACHE = `v${CACHE_VERSION}-permanent`;

export default {
  all: TEMPORARY_CACHE.concat([PERMANENT_CACHE]),
  permanent: PERMANENT_CACHE,
  temporary: TEMPORARY_CACHE,
  newest: TEMPORARY_CACHE[0],
  oldest: TEMPORARY_CACHE.slice(-1)[0], // last element
};
