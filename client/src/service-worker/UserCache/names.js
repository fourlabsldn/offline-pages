const CACHE_VERSION = 1;
const PERMANENT_CACHE = `v${CACHE_VERSION}-permanent`;


// Returns a string of the form DD/MM/YYYY
function daysAgo(num) {
  const millisecondsInADay = 86400000;
  const d = new Date(Date.now() - num * millisecondsInADay);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}


// We have a cache for each day of the week.
// We will erase cached files older than this.
// This part of the code is executed only o browser restart.
const temporaryCache = [
  `v${CACHE_VERSION}-${daysAgo(0)}`,
  `v${CACHE_VERSION}-${daysAgo(1)}`,
  `v${CACHE_VERSION}-${daysAgo(2)}`,
  `v${CACHE_VERSION}-${daysAgo(3)}`,
  `v${CACHE_VERSION}-${daysAgo(4)}`,
  `v${CACHE_VERSION}-${daysAgo(5)}`,
  `v${CACHE_VERSION}-${daysAgo(6)}`,
];

export default {
  all: temporaryCache.concat([PERMANENT_CACHE]),
  permanent: PERMANENT_CACHE,
  temporary: temporaryCache,
  newest: temporaryCache[0],
  oldest: temporaryCache.slice(-1)[0], // last element
};
