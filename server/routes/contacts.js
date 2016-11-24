const database = require('../database');

module.exports = (req, res) => {
  const data = database.get('contacts');
  res.locals.title = 'contacts';
  res.render('contacts', { data });
};
