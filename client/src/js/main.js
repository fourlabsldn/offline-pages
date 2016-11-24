function registerServiceWorker(fileName) {
  if (!(window.navigator && 'serviceWorker' in window.navigator)) {
    return;
  }

  // Only one service worker at a time is allowed. The newest ones kick
  // the oldest ones.
  window.navigator.serviceWorker.register(`/${fileName}.js`, { scope: '/' })
  .catch(err => {
    console.log('Cache ServiceWorker registration failed: ', err);
  });
}

const offlineNav = (function () {
  const cacheOnlySW = 'sw-caching';
  const fullSW = 'sw-everything-together';
  const key = 'offline-navigation-allowed';

  function isOn() {
    return 'true' === localStorage.getItem(key);
  }

  function set(on) {
    localStorage.setItem(key, !!on);

    if (!!on) {
      // Our offline navigation service worker will use notifications, so we
      // have to make sure to ask for permission if it still hasn't been granted.
      if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
      registerServiceWorker(fullSW);
    } else {
      registerServiceWorker(cacheOnlySW);
    }
  }

  return { isOn, set };
}());

// Make sure we register the currently allowed service worker on initialisation.
offlineNav.set(offlineNav.isOn());

document.addEventListener('DOMContentLoaded', () => {
  const swToggle = document.querySelector('#service-worker-toggle');

  swToggle.checked = offlineNav.isOn();

  swToggle.addEventListener('change', () => {
    console.log('Checked', swToggle.checked);
    offlineNav.set(swToggle.checked);
  });
});
