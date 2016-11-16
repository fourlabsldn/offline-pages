/* eslint-disable camelcase, no-param-reassign */

module.exports = (req, res) => {
  res.json(req.app.locals.messages);
};
