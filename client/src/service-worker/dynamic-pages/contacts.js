/* globals requirejs, require  */
/* eslint-disable global-require */
import '../requirejs';
import routes from '../routes';

// We will use a custom version of handlebars, which we will cache.
// The templates loaded asynchronously will also require handlebars,
// that's why we have the mapping.
requirejs.config({
  baseUrl: '/',
  map: {
    '*': { handlebars: `cacheFirst!${routes.contactsPage.handlebars}` },
  },
});

export default function (request, values, options) { // eslint-disable-line no-unused-vars
  return new Promise((resolve, reject) => {
    require([
      'handlebars',
      `cacheFirst!${routes.contactsPage.handlebarsHelpers}`,
      `cacheFirst!${routes.contactsPage.layoutTemplate}`,
      `cacheFirst!${routes.contactsPage.pageTemplate}`,
    ],
    (handlebars, helpers, layout, template) => {
      handlebars.registerHelper(helpers);

      const pageTemplate = handlebars.template(template);
      const compiledPage = pageTemplate({ name: 'Marcelo' });

      const layoutTemplate = handlebars.template(layout);
      const compiledLayout = layoutTemplate({ body: compiledPage });

      // We create a response with proper page headers
      const headers = {
        'access-control-allow-origin': '*',
        'content-length': compiledLayout.length,
        'content-type': 'text/html; charset=utf-8',
        date: new Date().toUTCString(),
      };

      const response = new Response(compiledLayout, { headers });
      resolve(response);
    },
    // on error, reject the promise
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
