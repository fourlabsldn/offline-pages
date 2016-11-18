/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');
const contactsFilePath = path.join(__dirname, 'db-contacts.json');
module.exports = (req, res) => {
  // We read the file in every request because in the test
  // it is important for us to be able to modify the values and
  // see a result live.
  const contacts = JSON.parse(fs.readFileSync(contactsFilePath));
  res.json(contacts);
};
