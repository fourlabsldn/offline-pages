/*
  Now that our worker is installed it is time to activate it

  Here we cleanup the cache, making sure we remove everything
  we won't use.
 */

import UserCache from './UserCache';

export default event => {
  console.log('activating');
  event.waitUntil(UserCache.cleanup());
};
