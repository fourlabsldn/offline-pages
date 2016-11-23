/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');
const contactsFilePath = path.join(__dirname, 'db-contacts.json');
const msgFileAddr = path.join(__dirname, 'db-messages.json');
const projectsFilePath = path.join(__dirname, 'db-projects.json');

module.exports = (req, res) => {
  const db = {
    contacts: JSON.parse(fs.readFileSync(contactsFilePath)),
    messages: JSON.parse(fs.readFileSync(msgFileAddr)),
    project: JSON.parse(fs.readFileSync(projectsFilePath)),
  };

  res.json(db);
};
