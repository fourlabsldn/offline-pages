/* eslint-disable no-param-reassign */
import localForage from 'localforage';
import requestSerialiser from './request-serialiser';
import notify from '../notify';

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
        return p;
      })
      .forEach(p => {
        p.then(_ => (p.resolved = true))
          .catch(_ => (p.rejected = true))
          .then(countFulfilled);
      });
  });
}

// Adds a request to a request queue.
async function queueRequest(req, queueName) {
  console.log('Request queued:', req.url);

  const queue = await localForage.getItem(queueName) || [];
  const serialised = await requestSerialiser.serialise(req);
  const newQueue = queue.concat([serialised]);
  await localForage.setItem(queueName, newQueue);
}

// Sends requests in the queue and schedules a new
// flush event if there are failures in sending.
async function flushRequestQueue(queueName) {
  console.log('Flushing', queueName);

  // Flush outbox
  const queue = await localForage.getItem(queueName) || [];
  console.log('Queue:', queue);
  const fulfilled = await fulfilAll(
    queue.map(r => fetch(requestSerialiser.deserialise(r)))
  );

  const failed = fulfilled
    .map((p, idx) => (p.rejected ? queue[idx] : null))
    .filter(r => r !== null);

  await localForage.setItem(queueName, failed);

  if (failed.length === 0) {
    notify('Messages sent', 'Yeeehaa! All of your messages were sent to the server.');
  } else {
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


/**
 * Store requests sent while offline and send them again
 * once we have internet connection.
 *
 * @method backgroundSync
 * @param  {Function} handler (Request -> Values -> Object) -> Promise<Response>
 * @param  {Function} customResponseCreator - [optional]. (Request) -> Response
 * @return {[type]} [description]
 */
export default function backgroundSync(handler, customResponseCreator) {
  return function (request, values, options) {
    return handler(request, values, options)
      .catch(async _ => {
        await schedule(request);
        if (customResponseCreator) {
          console.log('Returning custom response');
          return customResponseCreator(request);
        }

        console.log('Returning standard response');
        return new Response('{ "waiting": true }');
      });
  };
}
