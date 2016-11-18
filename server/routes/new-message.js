/* eslint-disable camelcase, no-param-reassign */

module.exports = (req, res) => {
  req.app.locals.messages = req.app.locals.messages || [];

  const newMessage = {
    content: req.body.content,
  };

  req.app.locals.messages.push(newMessage);

  res.json(req.app.locals.messages);
};
