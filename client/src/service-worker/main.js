

import install from './install';
self.addEventListener('fetch', install);


import activate from './activate';
self.addEventListener('activate', activate);

import fetchIntercept from './fetchIntercept';
self.addEventListener('fetch', fetchIntercept);
