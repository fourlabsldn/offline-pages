

import install from './install';
self.addEventListener('install', install);


import activate from './activate';
self.addEventListener('activate', activate);

import fetchIntercept from './fetch';
self.addEventListener('fetch', fetchIntercept);
