/* eslint-disable camelcase, no-param-reassign */

module.exports = (req, res) => {
  req.app.locals.messages = req.app.locals.messages || [];
  res.json(req.app.locals.messages);
};
