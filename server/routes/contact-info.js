const database = require('../database');

module.exports = (req, res) => {
  const contacts = database.get('contacts');
  const id = req.params.id;
  const data = contacts.find(c => c.id === id) || { name: 'No contact found' };

  res.locals.title = 'Contact info'; // eslint-disable-line no-param-reassign
  res.render('contact-info', { data });
};
