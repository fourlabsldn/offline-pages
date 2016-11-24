const sameDomainHtmlRequest = req => {
  const url = new URL(req.url);
  const accept = req.headers.get('accept') || '';
  return accept.includes('text/html') && url.origin === location.origin;
};

// Provide a fallback page for when offline
export default function htmlFallbackFor(handler, fallbackPage) {
  if (!fallbackPage) {
    throw new Error('htmlFallbackFor: Route parameter not set.');
  }

  return function (request, values, options) {
    return handler(request, values, options)
      .catch(err => {
        if (!sameDomainHtmlRequest(request)) {
          throw err;
        }

        // Let's first be quite sure that we really don't have
        // this in our cache
        return caches.match(request.url);
      })
      // If we don't, then let's get the fallback page
      .then(cached => (cached || caches.match(fallbackPage)))
      .then(response => {
        if (response) {
          return response;
        }

        throw new Error('Unable to fetch page', request.url);
      });
  };
}
