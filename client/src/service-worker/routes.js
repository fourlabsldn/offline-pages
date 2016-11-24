import { values } from 'lodash/fp';

const contactsPage = {
  layoutTemplate: '/api/precompiled/layouts.main.js',
  pageTemplate: '/api/precompiled/contact-info.js',
};

const dynamicPages = {
  handlebars: '/static/js/handlebars-modified.js',
  handlebarsHelpers: '/api/template-helpers/helpers-transpiled.js',
};

const database = {
  all: '/api/database',
};

const offlineFallback = {
  page: '/html/offline',
  thumbnail: '/static/images/offline.png',
};

const precache = [].concat(
  values(contactsPage),
  values(offlineFallback),
  values(database),
  values(dynamicPages)
);

export default {
  precache,
  contactsPage,
  offlineFallback,
  database,
  dynamicPages,
};
