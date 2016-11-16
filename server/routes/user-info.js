const fs = require('fs');

module.exports = (req, res) => {
  const { contacts } = JSON.parse(fs.readFileSync('./client/js/contacts.json'));
  const userId = req.query.id;

  res.json(contacts.find(c => c.id === userId));
};
