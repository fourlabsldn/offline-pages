/* globals requirejs, require  */
/* eslint-disable global-require */
import '../requirejs';

// We will use a custom version of handlebars, which we will cache.
// The templates loaded asynchronously will also require handlebars,
// that's why we have the mapping.
requirejs.config({
  baseUrl: '/',
  map: {
    '*': { handlebars: 'cacheFirst!handlebars-modified' },
  },
  paths: {
    'handlebars-modified': 'http://localhost:3000/static/js/handlebars-modified',
  },
});


export default function (request, values, options) {
  return new Promise((resolve, reject) => {
    require([
      'cacheFirst!http://localhost:3000/api/precompiled/layouts.main.js',
      'cacheFirst!http://localhost:3000/api/precompiled/contact-info.js',
      'cacheFirst!http://localhost:3000/api/template-helpers/helpers-transpiled.js',
      'handlebars',
    ],
    (layout, template, helpers, handlebars) => {
      handlebars.registerHelper(helpers);

      const pageTemplate = handlebars.template(template);
      const compiledPage = pageTemplate({ name: 'Marcelo' });

      const layoutTemplate = handlebars.template(layout);
      const compiledLayout = layoutTemplate({ body: compiledPage });

      const headers = {
        'access-control-allow-origin': '*',
        'content-length': compiledLayout.length,
        'content-type': 'text/html; charset=utf-8',
        date: new Date().toUTCString(),
      };

      const response = new Response(compiledLayout, { headers });
      resolve(response);
    },
    reject
    );
  })
  .catch(error => {
    console.log(`
      An error occurred trying to dynamically generate the page.
      Let's just fetch it from the server. Here is the error:
      ${error}
      `);

    return fetch(request.clone());
  });
}
