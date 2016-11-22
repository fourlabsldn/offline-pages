# Offline pages demo

This demo aims at implementing a reusable Service Worker that can easily be configured and that will handle:

### Caching of static resources in an *eventually fresh** manner ✓
> *eventually fresh cache* means that when a resource is requested a cached version is served and at the same time a fresh version is fetched from the server and cached to be served next time.


### Setup of cache fallback for failed requests of dynamic resources ✓

Certain requests, such as retrieval of database content, must always serve the most up to date content, but if the user is offline serving cached content will suffice.

### Cache size management ✓

This includes making sure that:

- Content is not cached for too long as old content is less relevant. ✓
- Content that is too big is handled correctly (using [indexedDB](https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API) and other storage options) ✓

### Reliable submission of requests made offline

If a user posts something while offline, this post should be intercepted by the service worker and submitted when the user gets online again.

I'm still thinking about how to differentiate between what matters and what doesn't in this one. We certainly would not want to re-issue all image requests when the user gets online. An alternative is to filter by HTTP method, but still I am not sure all `PUT` `DELETE` or `POST` requests should be re-issued when the user goes online. I am thinking of maybe checking for a specific request header, like `X-Offline-Reinforced` or something, that would tell the worker what to do with the request.

### Push notifications when offline actions are synchronised

When the user does something offline he must know that his action was not completed, but also know that it will be whenever he goes back online. For some requests, like form submission maybe, we would like to inform the user once the requests actually goes through.

This can be automated by setting a request header that will tell the service worker how to deal with the request. Somehing along the lines of `X-Offline-Notification`.

### Serving an offline placeholder page when non-cached pages are requested offline. ✓

Making the website available offline means the user never gets a "Oh no, you are offline" message. A placeholder page with the same layout as the rest of the website should be served instead. This will also allow re-enable the person to navigate through cached pages.

### Updating offline placeholder when needed ✓

Saying what to cache is not hard, but currently there is no set way of to dynamically tell the service worker when to renew content. This needs to be setup.

### Proactively download and cache crucial content ✓

Things are cached after they are requested at least once. To cache the most important pages of the website would require the user to visit these pages first. We don't want to count on that. The service worker must be able to download and cache crucial content before the user ever asks for it.

### Not cache what shouldn't be cached ✓

> With great power comes great responsibility

> *Uncle Ben*

The last thing we want is to have synchronisation problems because the website content just doesn't update.

Third party resources caching should  probably be left for the Browser to do.

## Dynamic page generation

To generate pages dynamically we will use handlebars templates that will be precompiled in the server and only fully rendered with the appropriate data in the client.

The client will pre-cache the necessary templates and data.

Not all browsers support service workers so there must be a way to access the page fully rendered by the server.

A possible URL scheme may look like this:
  - `http://domain.co.uk/<template-name>/` - Returns the pre-compiled template. Maybe should include a header specifying that the template rather than the html is wanted, so the client never accidentally navigate into the template page.
  - `http://domain.co.uk/<template-name>/<datapoint-id>` - This url should return the fully rendered page, so browsers without service-workers can access the content. Service-workers should intercept requests to this endpoint and generate the rendered page using the template and the precached data, avoiding server requests and making the page available offline. If the service-worker does not have the data to generate this page, it should then request it fully page from the server.
  - `http://domain.co.uk/<template-name>/<data>` - Endpoint containing the database records that should be used to render the template.


### Problems

  - We **must** use the same Handlebars helpers file in the server and client.
