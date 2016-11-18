function serialiseHeaders(h) {
  return [...h.entries()]
    .reduce((out, [key, value]) =>
      Object.assign({}, out, { [key]: value }),
      {}
    );
}

export default req => {
  const { method, body, mode, credentials, cache, redirect, referrer, integrity } = req;

  return {
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
