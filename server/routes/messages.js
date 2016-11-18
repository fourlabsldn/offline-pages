/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');

function loadMessages() {
  const msgFileAddr = path.join(__dirname, 'db-messages.json');
  const msgFileContent = fs.readFileSync(msgFileAddr);
  const messages = JSON.parse(msgFileContent);
  return messages || [];
}

module.exports = (req, res) => {
  req.app.locals.messages = loadMessages();
  res.json(req.app.locals.messages);
};
