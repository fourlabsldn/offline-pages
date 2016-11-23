/* globals requirejs, require  */
/* eslint-disable global-require */
import '../requirejs';

requirejs.config({
  baseUrl: '/',
  paths: {
    handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars',
  },
});

export default function (request, values, options) {
  return new Promise(resolve => {
    require([
      'cacheFirst!http://localhost:3000/api/precompiled/layouts.main',
      'cacheFirst!http://localhost:3000/api/precompiled/contact-info',
      'cacheFirst!http://localhost:3000/api/template-helpers/helpers-transpiled',
      'cacheFirst!http://localhost:3000/static/js/handlebars',
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
