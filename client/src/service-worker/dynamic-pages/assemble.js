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
    '*': { handlebars: `cacheFirst!${routes.dynamicPages.handlebars}` },
  },
});

export default function (layoutTemplateUrl, pageTemplateUrl, dataUrlArray, dataTransform) {
  return new Promise((resolve, reject) => {
    const dataDependencies = dataUrlArray.map(url => `cacheFirstJson!${url}`);

    // NOTE: Currently, if any dependency of this require call fails
    // the page will not be built dynamically for the entire life of the
    // service-worker execution context, which is basically until the browser is
    // closed. We need to think of a way to make that not be the case.
    // One solution is to append a random string at the end of each
    // dependency name, thus forcing requireJs to call cacheFirst again.
    require([
      'handlebars',
      `cacheFirst!${routes.dynamicPages.handlebarsHelpers}`,
      `cacheFirst!${layoutTemplateUrl}`,
      `cacheFirst!${pageTemplateUrl}`,
      ...dataDependencies,
    ],
    (handlebars, helpers, layoutTemplate, pageTemplate, ...data) => {
      handlebars.registerHelper(helpers);
      const { layoutData, pageData } = dataTransform(data);

      const precompiledPage = handlebars.template(pageTemplate);
      const compiledPage = precompiledPage(pageData);

      const finalLayoutData = Object.assign({}, layoutData, { body: compiledPage });
      const precompiledLayout = handlebars.template(layoutTemplate);
      const compiledLayout = precompiledLayout(finalLayoutData);

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
  });
}
