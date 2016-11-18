import { map, defaultTo } from 'lodash/fp';
import localForage from 'localforage';
import serialiseRequest from './serialise-request';

const OUTBOX = 'flush-outbox';

/**
 * Takes an array of promises and echoes it back
 * when all of them have either resolved of rejected
 *
 * adds 'resolved' and a 'rejected' properties to promises.
 *
 * @method fulfilAll
 * @param  {Array<Promise>} promiseArray
 * @return {Promise<Array<Promise>>} promiseArray
 */
function fulfilAll(promiseArray) {
  if (!Array.isArray(promiseArray)) {
    throw new TypeError(`${promiseArray} is not a valid Array.`);
  }

  return new Promise(resolve => {
    let fulfilledCount = 0;

    const countFulfilled = _ => {
      fulfilledCount = fulfilledCount + 1;
      if (fulfilledCount === promiseArray.length) {
        resolve(promiseArray);
      }
    };

    promiseArray
      .map(p => {
        p.resolved = false;
        p.rejected = false;
        return p
      })
      .forEach(p => {
        p.then(_ => (p.resolved = true))
          .catch(_ => (p.rejected = true))
          .then(countFulfilled);
      });
  });
}


function queueRequest(req, queueName) {
  console.log('Request queued:', req.url);
  const serialised = serialiseRequest(req);

  return localForage.getItem(queueName)
    .then(queue => queue || [])
    .then((queue = []) => queue.concat([serialised]))
    .then(newQueue => localForage.setItem(queueName, newQueue));
}

async function flushRequestQueue(queueName) {
  console.log('Flushing', queueName);

  // Flush outbox
  const queue = await localForage.getItem(queueName) || [];
  console.log('Queue:', queue);
  const fulfilled = await fulfilAll(
    queue.map(r => fetch(new Request(r)))
  );

  const failed = fulfilled
    .map((p, idx) => (p.rejected ? queue[idx] : null))
    .filter(r => r !== null);

  await localForage.setItem(queueName, failed);

  if (failed.length > 0) {
    self.registration.sync.register(queueName);
  }

  const newQueue = await localForage.getItem(queueName);
  console.log('New outbox:', newQueue);
}


// Listen to background sync events
self.addEventListener('sync', async event => {
  if (event.tag !== OUTBOX) {
    return;
  }

  event.waitUntil(flushRequestQueue(OUTBOX));
});

const schedule = (req) => {
  // Request a backgroundSync event
  self.registration.sync.register(OUTBOX);
  return queueRequest(req, OUTBOX);
};


// Provide a fallback page for when offline
export default function backgroundSync(handler) {
  return function (request, values, options) {
    return handler(request, values, options)
      .catch(_ => {
        schedule(request);
        return new Response('Fake response');
      });
  };
}
