import { values } from 'lodash/fp';

const contactsPage = {
  layoutTemplate: '/api/precompiled/layouts.main.js',
  pageTemplate: '/api/precompiled/contact-info.js',
  data: '/api/database/contacts',
};

const dynamicPages = {
  handlebars: '/static/js/handlebars-modified.js',
  handlebarsHelpers: '/api/template-helpers/helpers-transpiled.js',
};

const offlineFallback = {
  page: '/html/offline',
  thumbnail: '/static/images/offline.png',
};

const precache = [].concat(
  values(contactsPage),
  values(offlineFallback),
  values(dynamicPages),
  '/html/contacts',
  '/html/home',
  '/sw-caching.js'
);

export default {
  precache,
  contactsPage,
  offlineFallback,
  dynamicPages,
};
