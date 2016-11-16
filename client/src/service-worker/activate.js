/*
  Now that our worker is installed it is time to activate it

  Here we cleanup the cache, making sure we remove everything
  we won't use.

 */

import UserCache from './UserCache';
import { filter, includes, map } from 'lodash/fp';

export default serviceWorker => {
  serviceWorker.addEventListener('activate', event => {
    console.log('Activate event happened!');

    const cacheNames = UserCache.names();

    // Remove all caches whose name is not in cacheNames.all
    const cacheCleaning = caches
      .keys()
      .then(filter(cName => includes(cName, cacheNames.all)))
      .then(map(cName => caches.delete(cName)));

    event.waitUntil(cacheCleaning);
  });
};
