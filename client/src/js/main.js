
// Register service worker
if (window.navigator && 'serviceWorker' in window.navigator) {

  // Let's register the worker
  // For the worker to be able to manage requests from all paths,
  // we have to include it at the root of our website, as it can only
  // control requests to paths under the path it is in.
  window.navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(err => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
}