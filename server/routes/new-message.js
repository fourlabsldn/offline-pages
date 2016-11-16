/* eslint-disable camelcase, no-param-reassign */

module.exports = (req, res) => {
  req.app.locals.messages = req.app.locals.messages || [];

  const newMessage = {
    content: req.body.content,
    contactId: req.body.contactId,
  };

  req.app.locals.messages.push(newMessage);

  res.json(req.app.locals.messages);
};
