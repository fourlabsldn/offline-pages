import { map, filter } from 'lodash/fp';
import cacheNames from './names';

const notInCacheNames = cName => !cacheNames.all.includes(cName);

const deleteCache = cName => caches.delete(cName);

/**
 * Delete all caches that are too old.
 * @method cleanup
 * @return {Promise<void>}
 */
export default function cleanup() {
  console.log('Cleaning cache');

  // Remove all caches whose name is not in cacheNames.all
  return caches
    .keys()
    .then(filter(notInCacheNames))
    .then(map(deleteCache));
}
