import { values } from 'lodash/fp';

const contactsPage = {
  handlebars: '/static/js/handlebars-modified.js',
  handlebarsHelpers: '/api/template-helpers/helpers-transpiled.js',
  layoutTemplate: '/api/precompiled/layouts.main.js',
  pageTemplate: '/api/precompiled/contact-info.js',
};

const offlineFallback = {
  page: '/html/offline',
  thumbnail: '/static/images/offline.png',
};

const precache = [].concat(
  values(contactsPage),
  values(offlineFallback)
);

export default {
  contactsPage,
  offlineFallback,
  precache,
};
