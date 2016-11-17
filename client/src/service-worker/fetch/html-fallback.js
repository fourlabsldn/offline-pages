const isHtmlPageReques = req => {
  const accept = req.headers.get('accept') || '';
  return accept.includes('text/html');
};

// Provide a fallback page for when offline
export default function htmlFallbackFor(handler, route) {
  if (!route) {
    throw new Error('htmlFallbackFor: Route parameter not set.');
  }

  return function (request, values, options) {
    return handler(request, values, options)
      .catch(err => {
        if (!isHtmlPageReques(request)) {
          throw err;
        }

        return caches
        .match(route)
        .then(response => {
          if (response) {
            return response;
          }

          throw err;
        });
      });
  };
}
