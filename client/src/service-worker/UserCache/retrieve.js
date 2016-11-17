/**
 * Retrieves a response object based on a request object or
 * a url string
 *
 * Does not throw exceptions
 *
 * @method retrieve
 * @param  {Request} request
 * @return {Promise<Response>}
 */
export default request => {
  return caches
    .match(request)
    .catch(() => undefined);
};
