/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');
const msgFileAddr = path.join(__dirname, 'db-messages.json');

function loadMessages() {
  const msgFileContent = fs.readFileSync(msgFileAddr);
  const messages = JSON.parse(msgFileContent);
  return messages || [];
}

function setMessages(msg) {
  fs.writeFileSync(msgFileAddr, JSON.stringify(msg));
}

module.exports = (req, res) => {
  console.log('Request body', req.body);

  const messages = loadMessages() || [];
  const newMessage = req.body.content;
  const newMessages = messages.concat([newMessage]);
  setMessages(newMessages);

  res.json({ posted: true });
};
