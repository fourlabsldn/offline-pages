/*
  IMPORTANT!
  These helpers MUST be the same in the front-end and in the
  back-end.

  The front-end version must be transpiled.
 */
const swag = require('./swag');
const helpers = {};
swag.registerHelpers({ registerHelper(hn, hf) { helpers[hn] = hf; } });

module.exports = helpers;
