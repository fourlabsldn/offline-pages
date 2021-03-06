const serialiser = {};

function serialiseHeaders(h) {
  return [...h.entries()]
    .reduce((out, [key, value]) =>
      Object.assign({}, out, { [key]: value }),
      {}
    );
}

/**
 * @method serialise
 * @param  {Request} req
 * @return {Promise<Object>}
 */
serialiser.serialise = async primaryReq => {
  const req = primaryReq.clone();
  const body = await req.text();
  const { url, method, mode, credentials, cache, redirect, referrer, integrity } = req;

  return {
    url,
    method,
    body,
    mode,
    credentials,
    cache,
    redirect,
    referrer,
    integrity,
    headers: serialiseHeaders(req.headers),
  };
};


/**
 * @method deserialise
 * @param  {Object} req
 * @return {Request}
 */
serialiser.deserialise = serialised => {
  return new Request(serialised.url, serialised);
};

export default serialiser;
