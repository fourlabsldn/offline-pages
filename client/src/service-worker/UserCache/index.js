/*
  The CacheStorage API as of now, 17/11/2016, is quite flaky. Sometimes
  it works, sometimes it throws exceptions. Chrome still didn't implement
  some parts of it. Firefox is more advanced, but asking the user to stick to
  firefox sucks.

  For this reason we have this abstraction layer. Here we can implement
  caching however we want.
 */

import cleanup from './cleanup';
import save from './save';
import retrieve from './retrieve';
import load from './load';

// When we change our cache version all caches of previous versions are deleted
const UserCache = {
  cleanup,
  save,
  retrieve,
  load,
};

export default UserCache;
