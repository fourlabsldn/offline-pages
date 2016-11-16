/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');
const contactsFilePath = path.join(__dirname, '../../client/js/contacts.json');
module.exports = (req, res) => {
  const { id } = req.query;
  const { contacts } = JSON.parse(fs.readFileSync(contactsFilePath));

  const found = contacts.find(c => c.id === id);
  res.json(found);
};
