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
    // NOTE: Currently, if any dependency of this require call fails
    // the page will not be built dynamically for the entire life of the
    // service-worker execution context, which is basically until the browser is
    // closed. We need to think of a way to make that not be the case.
    // One solution is to append a random string at the end of each
    // dependency name, thus forcing requireJs to call cacheFirst again.
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
  .catch(_ => {
    // If we fail to build the page dynamically, let's just fetch it entirely
    // from the server.
    console.warn('Unable to build page dynamically');
    return fetch(request.clone());
  });
}
