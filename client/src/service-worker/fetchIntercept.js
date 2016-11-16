/*
  This function will be called every time there is a request
  to the website address. EVERY request to the website
  will call this function, whether the page is open or not.

  This means we must be sure not to do too much here and also
  keep in mind that if something goes wrong here, the whole
  website is affected.
 */

import UserCache from './UserCache';

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

export default event => {
  if (!cleanupDone) {
    console.log('WORKER: Doing cleanup');
    UserCache.cleanup();
    cleanupDone = true;
  }

  return;
};
