const database = require('../database');

module.exports = (req, res) => {
  const data = database.get('contacts');
  res.render('contacts', { data });
};
