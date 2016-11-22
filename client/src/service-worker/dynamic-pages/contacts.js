/* globals importScripts, requirejs, require */
importScripts('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.js');
requirejs.config({
  baseUrl: '/',
  paths: {
    handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars',
  },
});

export default function (request, values, options) {
  return new Promise(resolve => {
    require([
      'http://localhost:3000/api/precompiled/layouts.main',
      'http://localhost:3000/api/precompiled/contact-info',
      'http://localhost:3000/api/template-helpers/helpers-transpiled.js',
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
    });
  });
}
