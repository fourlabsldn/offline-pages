const database = require('../database');

module.exports = (req, res) => {
  const messages = database.get('messages');
  const newMessage = req.body.content;
  const newMessages = messages.concat([newMessage]);
  database.set('messages', newMessages);

  res.json({ posted: true });
};
